import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export async function createOrUpdateCurrentUser() { /*  Esta funcion devuelve el usuario de la sesion actual */
    const user = await currentUser()

    if (!user) { /* Si no esta el usuario retorname un null, no intentes hacer ninguna operacion porque no va funcionar */
        return null
    }


    const dbUser = await db.user.upsert({ /*Esta funcion puede ser un update o un create*/
        where: { id: user.id },
        update: {
            email: user.emailAddresses[0]?.emailAddress,
            username: `${user.firstName || ""} ${user.lastName || ""}`,
            avatar: user.imageUrl,
        },
        create: {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            username: `${user.firstName || ""} ${user.lastName || ""}`,
            avatar: user.imageUrl,
        }
    })

    return dbUser
}