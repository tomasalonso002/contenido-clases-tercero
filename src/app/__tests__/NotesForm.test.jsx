import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { it, describe, expect, vi, beforeEach } from "vitest";

import CreateNotePage from "../notes/create/page";
// Una funcion mock, es una funcion que imita a otra funcion, pero que cambia su funcionamiento por dentro, para no hacer testing del sistema con el rendimiento real del software
//vi: es un objeto de vites, nos permite acceder a muchas funcionalidades, como vi.fn(), que nos devuelve una funcion vacia(que no hace nada)

//simula useRouter() de Next.js para poder comprobar en los tests si se ejecuta router.push(), sin hacer una navegación real
const mockPush = vi.fn() //Funcion vacia
vi.mock("next/navigation", () => ({
    useRouter:() => ({
        push: mockPush
    })
}))

//Remplaza useNotes() por una versión falsa para que el test no dependa del contexto real
const mockAddNotes = vi.fn() // Función simulada para comprobar si se llama a addNote()
const mockGetDynamicCatetegories = vi.fn().mockReturnValue([  // Función simulada que devuelve categorías falsas para el test
    {id: "cat_1", title:"ejemplo"},
    {id: "cat_2", title:"ejemplo2"}
])
vi.mock("../context/NotesContext",() =>({
    useNotes:()=>({
        addNote:mockAddNotes, // Reemplaza addNote por nuestro mock
        getDynamicCategories: mockGetDynamicCatetegories // Reemplaza GetDynamicCategories por el mock
    })
}))


describe("Prueba de intregracion para: CreateNotePage", () =>{
    beforeEach(()=>{
        vi.clearAllMocks() //Esta funcion de clearAllMocks, se utiliza para limpiar las funciones de imitacion mock, para que no se pisen o dejen datos viejos
    })

    it("Debe guardar la nota y redirigir a /notes si la info es valida", async()=>{
       render(<CreateNotePage />)
       
       fireEvent.change(screen.getByPlaceholderText("Title"), {
            target: {value:"Titulo OK"}
       })

       fireEvent.change(screen.getByRole("combobox"),{
            target:{value:"Cat_1"}
       })

       fireEvent.change(screen.getByPlaceholderText('Content'),{
            target: {value:"El contenido debe tener al menos 10 Caracteres"}
       })

       fireEvent.change(screen.getByPlaceholderText('Cont variable =....'),{
            target:{value:"Cont variable = 10"}
       })

       fireEvent.click(screen.getByRole("button", {name:/save/i}))

        await waitFor( () => {
           expect(mockAddNotes).toHaveBeenCalledTimes(1)
           expect(mockAddNotes).toHaveBeenCalledWith({
                title:"Titulo OK",
                content:"El contenido debe tener al menos 10 Caracteres",
                ejemplo:"Cont variable = 10",
                categoryId:"Cat_1",
            })
            expect(mockPush).toHaveBeenCalledWith("/notes")
        })
    })
})