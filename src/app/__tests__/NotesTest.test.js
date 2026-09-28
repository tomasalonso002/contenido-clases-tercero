import { describe, it, expect } from "vitest";
import { notesSchema } from "../validations/notesSchema";

//describe: Agrupa los test por tematica, para la organizacion 
//it: Funcion de vites, indica un test especifico
//except: El rusultado del test, puede ser negativo o positivo, depende de la logica


//Test Unitarios
describe("Pruebas para notesSchema", () => {
    it("debe fallar si el titulo esta vacio", ()=>{
        const invalidData={
            title:"",
            content:"Contenido con mas de 10 caracteres",
            categoryId:"cat_123"
        }

        const result = notesSchema.safeParse(invalidData)

        expect(result.success).toBe(false)// "Estoy esperando que el resultado sea falso"
        
        if(!result.success){
            expect(result.error.issues[0].message).toBe("El titulo es obligatorio")
        }
    })

    it("debe fallar si el titulo supera los 40 caracteres",()=> {
        const invalidData = {
            title:"A".repeat(41),
            content:"Contenido valico con mas de 10 caractere",
            categoryId:"cat_123"
        }

        const result = notesSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
        if(!result.success){
            expect(result.error.issues[0].message).toBe("El titulo debe tener menos de 40 caracteres")
        }

    })

    it("debe fallar si contenido tiene menos de 10 caracteres",()=> {
        const invalidData = {
            title:"Titulo ok",
            content:"Corto",
            categoryId:"cat_123"
        }

        const result = notesSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
        if(!result.success){
            expect(result.error.issues[0].message).toBe("El contenido debe tener al menos 10 Caracteres")
        }

    })

    it("debe fallar si no se selecciona una categoria",()=> {
        const invalidData = {
            title:"Titulo ok",
            content:"Mas de 10 caracteres",
            categoryId:""
        }

        const result = notesSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
        if(!result.success){
            expect(result.error.issues[0].message).toBe("Debes seleccionar 1 categoria")
        }

    })

    it("debepermitir crear la nota sin el campo ejemplo",()=> {
        const invalidData = {
            title:"Titulo ok",
            content:"Mas de 10 caracteres",
            categoryId:"cat_123"
        }

        const result = notesSchema.safeParse(invalidData)
        expect(result.success).toBe(true)

    })


})




