import prisma from "../../utility/prismaClient"
import { Tlogin } from "./auth.interface"

const loginInDB = async (payload: Tlogin) => {
    const isUserExists = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: 'ACTIVE'
        }
    })

}

export const authService = {
    loginInDB
}