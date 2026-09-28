import { createOrUpdateCurrentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request,{params}){
    try{
        const user = await createOrUpdateCurrentUser()
        if (!user) return NextResponse.json({error:'no auth'}, {status:401})

        const{ id } = await params 
        const data = await request.json()
        
        const updatedData = {}

        if (data.title !== undefined ) updatedData.title = data.title
        if (data.content !== undefined ) updatedData.content = data.content
        if (data.ejemplo !== undefined ) updatedData.ejemplo = data.ejemplo

        const rawCategoryId = data.categoryId

        if(!rawCategoryId !== undefined && !rawCategoryId === null){
            const parsedCategoryId = parseInt(rawCategoryId)
            if(!isNaN(parsedCategoryId)){
                updatedData.categoryId = parsedCategoryId
            }
        }

        const updatedNote = db.note.update({
            where: {
                id:parseInt(id),
                userId: user.id

            },
            data: updatedData,
            include : {category:true},
        })
        return NextResponse.json(updatedNote)
    }catch(error){
        return NextResponse.json({error: 'error en el put de notes'},{status:500})
    }
}

export async function DELETE( request, {params}) {
    try{
        const user = await createOrUpdateCurrentUser()
        if (!user) return NextResponse.json({error:'no auth'}, {status:401})
        
            const { id } = await params
        await db.note.delete({
            where: {
                id:parseInt(id),
                userId: user.id
             },
        })
        return NextResponse.json({message: 'Nota eliminado'})
        
    }catch(error){
        return NextResponse.json({error: 'error en el delete de notes'},{status:500})
    }
}

