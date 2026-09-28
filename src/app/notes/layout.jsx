"use client";
import Aside from "@/app/components/Aside"
import { useNotes, NotesProvider } from "../context/NotesContext"

function LayoutContext({ children }){
    const { getDynamicCategories } = useNotes()
    const categorias = getDynamicCategories()
    
    return (
      <div className="flex min-h-screen bg-zinc-900">
        <Aside data={categorias} />
        {children}
      </div>
    )
}

export default function NotasLayout({ children }) {
  return(
    <NotesProvider>
      <LayoutContext>
        { children }
      </LayoutContext>
    </NotesProvider>
  )
}

