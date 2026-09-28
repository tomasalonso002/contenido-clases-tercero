import { NextResponse } from "next/server";

export async function POST(request) {
    try{
    const {notes, messages} = await request.json()
    
    const messagesFormateadas = messages
    .map(m =>`${m.role === 'user' ? 'Usuario' : 'IA'}:${m.text}`)
    .join("\n")

    const notesFormateadas = notes
    .map(n =>`-Titulo:${n.title}\n contenido: ${n.content}`)
    .join("\n\n")

    const promptCompleto = `
        Eres "Itec IA" UN MODELO DE IA avanzado integrado a un sistema de notas y documentacion sobre desarrollo.
        Responde de forma sumamamente tecnica a las dudas del usuario.
        Ve directo al grano.

        Tienes acceso a la base de datos del usuario, debes priorizar esta infoprmacion para responder.

        NOTAS ACTUALES DEL USUARIO
        ${notesFormateadas}

        HISTORIAL DEL CHAT
        ${messagesFormateadas}
        
        responde al ultimo mensaje del usuario de forma conversaciona.
        Si usas codifo usa bloque de markdown
    `
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey){
        return NextResponse.json({ error: "Configuracion incompleta: FALTA EL API KEY!"}, {status:500})
    }
    //Endpoin a la cual le queremos solicitar una respuesta
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${apiKey}`

    const response = await fetch(url,{
        method:"POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            contents:[{parts:[{text:promptCompleto}]}]
        })
    })

    const data = await response.json()

    if(!response.ok || data.error ){
        console.error("Error en la API de google:", data.error)
        return NextResponse.json({ 
            error: `Error en la API de google: ${data.error?.messages}`|| "Peticion Invalida"
        }, {status:response.status || 400 })


    }
    
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No pude  generar una respuesta"

    return NextResponse.json({ success: true, result:aiText})

    }catch(err){
        console.error(`Error critico en ruta /api/ai:${err}`)
        return NextResponse.json({ error: err}, {status:500})
    }
}