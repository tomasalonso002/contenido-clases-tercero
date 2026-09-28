"use client"
import { useState } from "react"
import { useNotes } from "@/app/context/NotesContext"
import axios from "axios"
import ReactMarkdown from "react-markdown"

export default function ChatModal({isOpen, onClose}){
    const{notes} = useNotes()
    const [input, setInput]=useState("")
    const [error, setError]=useState(null)
    const [loading, setLoading]=useState(false)
    const [messages, setMessags]=useState([
           {
            id:"1", 
            role:"assistant",
            text:"Hola q necesita"},
        ])
    //La funcion del boton de enviar mensaje al chat
    const handleSendMessage = async (e) => {
        //evita el comportamiento porfedault(evita que se recargue la pagina)
        e.preventDefault()
        //Verifica que el usuario halla escrito algo o no este pensando la ia
        if(!input.trim() || loading)return

        //Si no pasa nada del if de arriba se ejecuta lo siguiente 
        const userMessage = {id:crypto.randomUUID(), role:"user", text: input} //Agrega este mensaje a setMessages
        setMessags(prev => [...prev, userMessage])
        setInput("") 
        setLoading(true) //se activa la const de que la IA esta pensando
        setError(null)  //Se define el error como null, pq todavia no ocurrio ningun error

        try{ //Intenta comunicaese con el archivo y le intenta pasar todas las notes y el historial de mensajes
            const response =await axios.post("/api/ai",{    //Lo que responda la IA, lo guarda en una variable llamada response
                notes:notes,
                messages:[...messages, userMessage]
            })
            setMessags(prev => [...prev,{
                id:crypto.randomUUID(),
                role:"assistant",
                text:response.data.result   
            }])
        } catch (err) {
            setError(err.response?.data?.error || "Error al conectar con la IA") //En el caso de que en algun proceso halla un error, salta este error
        } finally{
            setLoading(false)   //Actualiza el estado de la IA, ya no esta cargando nada
        }
    }
    
    if(!isOpen) return null
    
    return(
        <div className="fixed insert-0 z-50 flex items-center justify-center bg-black/40 bakdrop-blur-xs">
            <div className=" w-full max-w-xl bg-zinc-900 border-zinc-700 rounded-lg p-4 flex flex-col h-125">
                <div className="flex justify-between items-center border-b border-zinc-700">
                    <span className="font-bld text-sm">
                        Itec IA
                    </span>
                
                    <button className="gb-zinc-700 px-2 py-1 rounded cursor-pointer"
                        onClick={onClose}>
                            CERRAR!
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3">
                    {messages.map((msg)=>(
                        <div 
                        key={msg.id}
                        className= {`rounded p-2 max-w-[85%] ${msg.role === "user" ? "bg-zinc-700 ml-auto":"bg-purple-700"}`}>
                        <p className="block text-xs text-zinc-400">
                            {msg.role === "user"?"Tu":"IA"}
                        </p>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    ))}

                    {loading && <p>Cargando...</p>}
                    {error && <p>{error}</p>}
                </div>

                <div>
                    <form  onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-zinc-700"> 
                        <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                        placeholder="Escribe tu mensaje"
                        className=" flex-1 bg-zinc-800 px-2 py-1.5 border outline-none focus:border-purple-500 "
                        >
                        
                        </input>
                        <button
                        type="submit"
                        disabled={loading || !input}
                        className="bg-purple-600 px-3 py-1.5 rounded font-bold">
                            Enviar
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}