"use client"
import { useState, useEffect } from "react"
import { useNotes } from "../context/NotesContext"

export default function NoteDetail({ note }) {
  const {updateNote} = useNotes()
  const [copied, setCopied] = useState(false)

  //Un state para que me diga que campo es el que estoy editando
  const [editingField, setEditingField] = useState(null) //"title" o "content" o "ejemplo" o"null"
  
  //MODIFICAR LOS VALORES DEL FORM CUANDO LLEGA NOTES/ hay dos formas de hacerlo, con un useState para cada capo y que cada uno tenga su handle o hacer todo en un solo state
  const[formData, setFormData] = useState({
    title:"",
    content:"",
    ejemplo:""
  }) 

  //Cada vez que la variable note cambie, se va a ejecutar el useEffect o cuando se recarge la pantalla 
  useEffect(()=>{
    if(note){
      setFormData({
        title:note.title,
        content: note.content,
        ejemplo: note.ejemplo || "",
      })
    }
  }, [note])

  const handleCopy = ()=> {
    if (note.ejemplo){
      navigator.clipboard.writeText(note.ejemplo)  
      setCopied(true)
      setTimeout(()=>setCopied(false),2000)
    }
  }

  //Agarrar todo el estado que acabamos de crear llamado "formData" y mandarlo a updateNote
  const handleSave = () =>{
    updateNote(note.id, formData)
    setEditingField(null)
  }

  const EditPencil =() =>(
    <svg  width="16" height="16" fill="currentColor" className="bi bi-pencil opacity-0 group-hover:opacity-100" viewBox="0 0 16 16">
      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
    </svg>  
  )


  return (
    <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <div 
        className="w-full hover:bg-zinc-700 transition-colors cursor-pointer rounded p-2 group"
        onDoubleClick={() => setEditingField("title")}
        title="Doble click para editar"
        >
          {editingField == "title"? (
            <input
            type="text"
            value={formData.title}
            onChange={(e)=> setFormData({ ...formData, title: e.target.value})}
            className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50"
            />
            
          ):(
            <div className="flex items-center gap-2">
            <h1 className="max-w-xs text-3xl focus:outline-none focus:ring-2 focus:ring-green-300 w-full p-3 rounded m-1 font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              {note.title}
            </h1>
            <EditPencil />
          </div>
          )}
        </div>
      </div>
    <div
      className="w-full  hover:bg-zinc-700 transition-colors cursor-pointer rounded p-2 group"
      onDoubleClick={() => setEditingField("content")}
      title="Doble clik para editar"
      >

      {editingField == "content" ? (
        <textarea
        type="text"
        value={formData.content}
        onChange={(e)=> setFormData({...formData, content:e.target.value})}
        autoFocus
        className=" w-full min-h-auto text-justify focus:outline-none focus:ring-2 focus:ring-green-300 p-3 rounded m-1 leading-10 tracking-tight text-black dark:text-zinc-50"
        
        />
      ):(
      <div className="flex gap-2 items-center">
        <EditPencil />
        <p className='text-justify'>
          {note.content}
        </p>
      </div>
      )}
    </div>
      {/* Ejemplo de como funcionan los arrays */}
      <section 
        className='w-full min-h-64 my-8 p-4 rounded-lg flex flex-col bg-zinc-800 text-white justify-between group hover:ring-2 ring-zinc-600'
        onDoubleClick={()=>setEditingField("ejemplo")}
        title="Doble click para editar"
      >
      <div className="flex justify-between cursor-pointer ">
        <div className="flex gap-2 items-center">
          <p className='text-lg font-semibold'>Ejemplo {note.title}</p>
          <EditPencil/>
        </div>
          <button 
          onClick={handleCopy}
          className="top-2 right-2 cursor-pointer">
            { copied ? (
              <svg  width="20" height="20" fill="currentColor" className="bi bi-clipboard-check text-green-500" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
              </svg>
            ):(
              <svg width="20" height="20" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
               <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
              </svg>
            )}
          </button>
        </div> 
        <div className="mt-2 group">
          {editingField == "ejemplo" ? (
            <textarea
            value={formData.ejemplo}
            onChange={(e)=> setFormData({...formData, ejemplo: e.target.value})}
            autoFocus
            className="className='text-sm m-h-64 text-white bg-black rounded p-2 overflow-x-auto w-full resize-none "
            />
          ):(
            <pre className='text-sm text-white bg-black rounded p-2 overflow-x-auto'>
              <code >
                {note.ejemplo}
              </code>
            </pre>
          )}
        </div>
      </section>
      {editingField && (
        <button
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-500 px-3 py-3 rounded cursor-pointer text-white">
          Save
        </button>
      )}

    </main>
  )
}