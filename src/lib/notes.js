export const categories = [
  { id: 1, title: "Rutas"},
  { id: 2, title: "Componentes"},
  { id: 3, title: "Layouts"},
  { id: 4, title: "Operadores"},
]

export const notes = [
  {
    id: "1",
    title: "Rutas en Next.js",
    category_id: 1,
    content: "Next.js utiliza un sistema de rutas basado en el sistema de archivos dentro de la carpeta app. Cada archivo page.jsx define automáticamente una ruta accesible desde el navegador. Por ejemplo, app/page.jsx corresponde a la ruta '/', mientras que app/about/page.jsx corresponde a '/about'. Esto elimina la necesidad de configurar manualmente un router como en otras librerías.",
    createdAt: "2026-01-01",
    ejemplo: `
app/
  page.jsx        // → /
  about/
    page.jsx      // → /about

export default function Page() {
  return <h1>Home</h1>
}
    `
  },
  {
    id: "2",
    title: "Rutas dinámicas",
    category_id: 1,
    content: "Las rutas dinámicas en Next.js permiten renderizar contenido basado en parámetros de la URL. Se definen usando corchetes en el nombre de la carpeta, como [id]. Next.js inyecta automáticamente estos valores en el objeto params dentro del componente, permitiendo acceder a datos dinámicos como IDs de una base de datos.",
    createdAt: "2026-01-02",
    ejemplo: `
export default async function page({ params }) {

  const { id } = await params
  const nota = getNoteById(id)

  return (
    <div className="flex flex-1 items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <NoteDetail note={nota} />
    </div>
  )
}

    `
  },
  {
    id: "3",
    title: "Rutas anidadas",
    category_id: 1,
    content: "Las rutas anidadas permiten estructurar la aplicación en múltiples niveles utilizando carpetas dentro de otras carpetas. Esto ayuda a organizar mejor proyectos grandes y permite reutilizar layouts o lógica entre rutas relacionadas.",
    createdAt: "2026-01-03",
    ejemplo: `
app/
  dashboard/
    page.jsx            // → /dashboard
    settings/
      page.jsx          // → /dashboard/settings

// Navegación
<Link href="/dashboard/settings">Settings</Link>
    `
  },
  {
    id: "4",
    title: "Layouts en Next.js",
    category_id: 3,
    content: "Los layouts permiten compartir UI entre múltiples páginas, como navbars, sidebars o footers. Se definen con un archivo layout.jsx y envuelven automáticamente a todas las páginas dentro de su carpeta. Reciben la prop children que representa el contenido de cada página.",
    createdAt: "2026-01-04",
    ejemplo: `
export default function Layout({ children }) {
  return (
    <div>
      <nav>Navbar</nav>
      {children}
    </div>
  )
}
    `
  },
  {
    id: "5",
    title: "Layouts anidados",
    category_id: 3,
    content: "Next.js permite tener múltiples layouts anidados. Cada layout envuelve al siguiente nivel de la jerarquía, permitiendo construir estructuras complejas de UI. Por ejemplo, un layout global puede contener un navbar, mientras que un layout interno puede agregar un sidebar específico.",
    createdAt: "2026-01-05",
    ejemplo: `
app/
  layout.jsx
  dashboard/
    layout.jsx
    page.jsx

// Resultado:
// Layout global → Layout dashboard → Page
    `
  },
  {
    id: "6",
    title: "Componentes de servidor",
    category_id: 2,
    content: "En Next.js App Router, los componentes son Server Components por defecto. Esto significa que se ejecutan en el servidor, no envían JavaScript innecesario al cliente y pueden acceder directamente a bases de datos o APIs. No pueden usar hooks como useState o useEffect, pero mejoran significativamente el rendimiento.",
    createdAt: "2026-01-06",
    ejemplo: `
export default async function Page() {
  const data = await fetch("https://api.example.com")

  return (
    <div>
      <h1>Datos:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
    `
  },
  {
    id: "7",
    title: "Spread operator",
    category_id: 4,
    content: "El spread operator en JavaScript permite expandir elementos de un array o propiedades de un objeto en otro array o objeto. Es útil para crear copias de arrays u objetos con modificaciones menores.",
    createdAt: "2026-01-06",
    ejemplo: `
const obj1 = { a: 1, b: 2 }
const obj2 = { ...obj1, c: 3 } // { a: 1, b: 2, c: 3 }

const arr1 = [1, 2, 3]
const arr2 = [...arr1, 4] // [1, 2, 3, 4]
    `
  },
]
// Devuelve todas las notas del array "notes"
export const getNotes = () => notes


// Busca UNA nota por id
// find() recorre el array hasta encontrar la primera coincidencia
export const getNoteById = (id) =>
  notes.find((note) => note.id === id)


// Devuelve las categorías junto con sus notas
export const getCategories = () => {
  return categories.map((category) => ({
    
    // Copia todas las propiedades de la categoría
    // Ej: id, title, etc.
    ...category, // spread operator

    // Agrega una nueva propiedad llamada "notes"
    // con las notas que pertenecen a esa categoría
    notes: notes.filter(
      (note) => note.category_id == category.id
    )
  }))
}