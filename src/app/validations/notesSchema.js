import {z} from 'zod';

// Schemas para validar formularios de carga de user, category, Notes, etc

export const notesSchema = z.object({
    title:z.string().min(1, 'El titulo es obligatorio').max(40, 'El titulo debe tener menos de 40 caracteres'),
    content:z.string().min(10,'El contenido debe tener al menos 10 Caracteres'),
    ejemplo:z.string().optional(),
    categoryId:z.string().min(1,'Debes seleccionar 1 categoria'),
})
