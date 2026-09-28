"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { notes as defaultNotes, categories as defaultCategories } from "@/lib/notes";
import axios from "axios";


const NotesContext = createContext()

export function NotesProvider({ children }){

    const [notes, setNotes] = useState([])
    const [categories, setCategories] =useState([])
    const [isMounted, setIsMounted] = useState(false)

    useEffect(()=>{
        const fetchInitialData = async () => {
        try{
                const [notesRes, categoriesRes] = await Promise.all([
                    axios.get('/api/notes'),
                    axios.get('/api/categories'),
                ])
                
                setNotes(notesRes.data)
                setCategories(categoriesRes.data)
        
        }catch(error){
            console.error('Error al obtener datos: ', error)
        } finally{ //Sin importar si es try o catch el finally avisa que se monto el componente
            setIsMounted(true)
        }
    }
    
        fetchInitialData()
    }, [])
  
    
    //helpers
    //Los helpers son funciones cortitas que buscan guardar datos en la localstorage
    //Agregar nota
    const addNote=async (note) => {
        try{
            
            const response = await axios.post('/api/notes', note)
            setNotes((prevNotes) => [response.data, ...prevNotes])
        } catch(error){
            console.error('Error al crear la nota ', error)
        }
    }
    
    //actualizar nota
    const updateNote = async (id, updatedFields)=>{
        try{
            const response = await axios.put(`/api/notes/${id}`, updatedFields)
            setNotes((prevNotes) => //Se hace un map de todas las nbotas y se remplaza el que tenga el mismo id "Si la nota actual es igual a la que se esta actualizando"
                prevNotes.map((note) =>            // yo quiero que response.data remplaze a la nota actual, si no es el caso que quede igual
                    String(id) === String(note.id) ? response.data : note
                )
            )
        }catch(err){
            console.err('Error al actualizar la nota ', err)
        }
    }

    //Eliminar nota
    const deleteNote = async (id) => {
        try{
            const response = await axios.delete(`/api/notes/${id}`)
            setNotes((prevNotes)=>
                prevNotes.filter((note)=> String(note.id) !== String(id))
            )
        } catch(err){
            console.err('Error al borrar la nota: ', err)
        }
    }

    //Agregar categoria
    const addCategories = async (title) => {
        try {
            const response = await axios.post('/api/categories', { title })
            setCategories((prevCategories) => [...prevCategories, response.data])
        } catch (error) {
            console.error("Error al crear la categoria: ", error)
        }
    }



    //Trae una nota 
    const getNoteById = (id) => notes.find(note => String(note.id) === String(id))
    
    //Forma dinamica las categorias con sus notas
    const getDynamicCategories =() => {
        return categories.map(category => ({
            ...category,//esto significa TODO category (su id, nombre, titulo)
            notes: notes.filter(note => String(note.categoryId)=== String(category.id))
        }))
    }
    //Si no esta montado retorna null
    if(!isMounted)return null

    return(//Esto esta envolvolviendo todas las rutas
        <NotesContext.Provider value={{
            notes,
            categories,
            addNote,
            updateNote,
            deleteNote,
            addCategories,
            getNoteById,
            getDynamicCategories,
            }}>
            {children}
        </NotesContext.Provider>
    )
}
// Hook personalizado para acceder fácilmente al contexto de las notas
export const useNotes = () => useContext(NotesContext)