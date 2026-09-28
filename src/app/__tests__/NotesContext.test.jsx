import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach  } from "vitest";
import { NotesProvider, useNotes } from "../context/NotesContext";
import axios from "axios";

//act = Espera que termine de procesar la ejecucion de dentro, si lo que tiene adentro tiene un await espera que rtermine de ejecutarlo. Lo usas cada vez que necesitas que tenes que esperar una respuesta.


vi.mock("axios")
//Test del context

const wrapper = ({children }) => <NotesProvider>{ children }</NotesProvider>
describe("Pruebas del custom hook: useNotes",()=>{
    
    beforeEach(()=>{
        vi.clearAllMocks()
        //Simulacion de las respuestas get de axios
        axios.get.mockImplementation((url)=>{
            if(url == "/api/notes"){
                return Promise.resolve({data:[{id:1, title:"Nota Inicial", content:"El contenido de mi nota", ejemplo:"let x", categoryId:"cat_1"}]})
            }

            if(url == "/api/categories"){
                return Promise.resolve({data:[{id:1, title:"Categoria inicial"}]})
            }
            return Promise.resolve({error:"404 Ruta no encontrada"})
        })  
    })

    it("debe cargar los datos iniciales de notas y categorias",async ()=>{
        const {result}= renderHook(()=>useNotes(), { wrapper })

        await waitFor(() => {
            expect(result.current.notes).toHaveLength(1)
            expect(result.current.categories).toHaveLength(1)
        })
        expect(result.current.notes[0].title).toBe("Nota Inicial")            
    })
    
    //Test funcion para POST

    it("Debe agregar una nueva nota con addNote", async()=>{
        //creamos un objeto nuevo
        const newNote = {id:1, title:"Nota nueva", content:"El contenido de mi nota", ejemplo:"let x", categoryId:"cat_1"}
        
        axios.post.mockResolvedValueOnce({ data:newNote })
        //Envolvemos nuesto test en el wrapper de useNot
        const { result } = renderHook(()=> useNotes(), { wrapper })

        //Esperamos que nos llegue algo de la peticion
        await waitFor(()=>{expect(result.current.notes).toHaveLength(1)})

        //Nos fijamos que es lo que nos llega
        await act( async () => {
            await result.current.addNote({title:"Nota nueva", content:"El contenido de mi nota"})
        })
        
        expect( axios.post).toHaveBeenCalledWith("/api/notes",{title:"Nota nueva", content:"El contenido de mi nota"})
        
    })




})


