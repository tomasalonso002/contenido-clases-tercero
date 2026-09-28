import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createOrUpdateCurrentUser } from "@/lib/currentUser";

export async function GET() {
    try {
        const user = await createOrUpdateCurrentUser()
        if (!user) return NextResponse.json({ error: "no auth" }, { status: 401 })

        const notes = await db.note.findMany({
            where: {
                userId: user.id
            },
            include: {
                category: true,
                user: true,
            },
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(notes)
    } catch (error) {
        return NextResponse.json({ error: "error en el get de notes" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const user = await createOrUpdateCurrentUser()
        if (!user) return NextResponse.json({ error: "no auth" }, { status: 401 })

        const data = await request.json()
        const categoryId = parseInt(data.categoryId)

        if (!data.title || !data.content || isNaN(categoryId)) {
            return NextResponse.json({ error: "ingresar titulo, contenido y categoryId debe ser un numero" }, { status: 400 })
        }

        const newNote = await db.note.create({
            data: {
                title: data.title,
                content: data.content,
                ejemplo: data.ejemplo,
                categoryId: categoryId,
                userId: user.id
            },
            include: {
                category: true
            }
        })
        return NextResponse.json(newNote, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "error en el post de notes" }, { status: 500 })
    }
}