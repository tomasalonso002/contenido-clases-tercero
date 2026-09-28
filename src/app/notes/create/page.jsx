"use client"
import { useState } from 'react'
import { useNotes } from '../../context/NotesContext'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { notesSchema } from '@/app/validations/notesSchema'


import axios from 'axios'
import Link from 'next/link'
import React from 'react'




function CreateNotePage() {
  const router = useRouter()
  

  
  const {addNote, getDynamicCategories }= useNotes()

  const categories = getDynamicCategories()



  const { register, handleSubmit, formState:{errors} } = useForm({
    resolver: zodResolver(notesSchema),
    defaultValues:{
      title:"",
      content:"",
      ejemplo:"",
      categoryId:"",
    }
  }) 

  const [tema, setTema]= useState("")
  const [loading, setLoading]=useState(false)


  console.log(errors)

  const onSubmit =(data)=>{
    addNote(data)
    router.push('/notes')
  }


  const handleAutoFill = async(e) =>{
    e.preventDefault()
    setLoading(!loading)

    if (!tema || loading) return
    setLoading(true)
    try{
      const response = await axios.post("/api/generate-note/",{tema})
      setFormData({
        title: response.data.result.title,
        content:response.data.result.content,
        ejemplo:response.data.result.ejemplo
      })
      console.log(response)
    }catch(err){
      console.error(err)
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  return (
    <section className='flex p-20 justify-center items-center w-full'>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1  p-6 rounded-lg bg-zinc-800 font-sans">
        
        <Link href={"/notes"} className="self-start mb-4 text-white font-semibold">
          &larr; Back to Notes
        </Link>

        <p className="text-white text-lg font-semibold">Create Note</p>


      <div className=' mt-6 p-4 rounded border border-purple-500/30 gap-2 bg-zinc-900 flex flex-col'>
        <label className='text-purple-400 text-xs font-bold tracking-wider'>Itec Copilot</label>
        <div className='flex gap-2'>
          <input type="text"
          placeholder='Ej: Arrow functio en JS ...'
          value={tema}
          className='flex-1 p-2 bg-zinc-800 rounded border-zinc-700 focus:outline-none focus:ring-1 ring-purple-800'
          onChange={(e)=> setTema(e.target.value)}>
          </input>

          <button
          type='submit'
          onClick={handleAutoFill}
          disabled={loading}
          className='bg-purple-600 hover:bg-purple-700 text-xs px-4  py-1 fonts-bold rounded disabled:opacity-50 cursor-pointer'
          >
          {loading ? ("Generando...."):"Generar"}
          
          </button>
        </div>
      </div>



        <div className='mt-10 flex flex-col gap-3'>

          <div className='flex flex-col'>
            <p className='text-zinc-400'>Titulo <label className='text-red-700 animate-pulse'>{errors.title && errors.title.message} </label></p>
            <input
             type="text"
             placeholder='Title'
             className={`p-2 border border-zinc-600 rounded-md my-4 bg-zinc-900/89 focus:outline-none focus:ring-1 ring-purple-800 ${loading && "animate-pulse"}`}
             //value={formData.title}
             //detecta cada vez que hay un cambio en el campo y dispara un evento, "Todo lo que tenia antes, mas el titulo cambiado" lo mismo para los otros onChange
             //onChange={(e) => setFormData({...formData,title: e.target.value})}
             {...register('title')}
             />
          </div>

            {/*Select controlado: muestra la categoría seleccionada y al cambiarla actualiza el estado formData copiando los datos anteriores y reemplazando category_id por el valor elegido convertido a número*/}
          <div className='flex flex-col'>
            <label className='text-zinc-400'>Categoria</label>
            {/*En el onChange se pone string pq el ID que colocamos entrega ID con caracteres aleatorios y si ponemos parseInt va a retornar un value = NaN, en el caso que el id sea 100% un numero, se pone parseInt*/}
        <select 
            className="p-2 cursor-pointer bg-zinc-900/89 border border-zinc-500 rounded-md my-4 focus:outline-none focus:ring-1 ring-purple-800"
            //value={formData.categoryId}
            //</div>onChange={(e) => setFormData({ ...formData,categoryId: String(e.target.value)})}
              {...register('categoryId')}
              >
              <option value="" disabled>
                  Select category
              </option>

              {categories.map(category => (
                  <option 
                      className="bg-zinc-900/89" 
                      key={category.id} 
                      value={category.id}
                  >
                      {category.title}
                  </option>
              ))}
          </select>
          </div>

          <div className='flex flex-col'>
            <p className='text-zinc-400'>Contentido<label className='text-red-700 animate-pulse'>{errors.content && errors.content.message} </label></p>
          <textarea 
            placeholder='Content' 
            className={`p-2 border border-zinc-600 rounded-md my-4 bg-zinc-900/89 focus:outline-none focus:ring-1 ring-purple-800 ${loading && "animate-pulse"}`} rows={10} 
            //value={formData.content}
            //onChange={(e)=>setFormData({ ...formData, content: e.target.value })}
            {...register('content')}
            />
          </div>

          <div className='flex flex-col'>
            <label className='text-zinc-400'>Ejemplo</label>
          <textarea 
            placeholder='Cont variable =....' 
            className={`p-2 border border-zinc-600 rounded-md my-4  bg-zinc-900/89 focus:outline-none focus:ring-1 ring-purple-800 ${loading && "animate-pulse"}`} rows={10} 
            //value={formData.ejemplo}
            //onChange={(e)=>setFormData({ ...formData, ejemplo: e.target.value })}
            {...register('ejemplo')}
            />
          </div>

          <button type='submit' className='bg-blue-500 text-white p-2 rounded-md cursor-pointer'>Save</button>
        
        </div>

      </form>
    </section>
  )
}

export default CreateNotePage