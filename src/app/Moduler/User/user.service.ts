import { UserRole } from "@prisma/client";
import { Tadmin } from "./user.interface";
import bcrypt from 'bcrypt'
import prisma from "../../utility/prismaClient";
import config from "../../config";




const createAdminIntoDB = async (payload: Tadmin) => {

    const hashPassword = await bcrypt.hash(payload.password, Number(config.hash_salt_round as string))

    const userData = {
        email: payload.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (tx) => {
        await tx.user.create({
            data: userData
        })
        const createAdmin = await tx.admin.create({
            data: payload.admin
        })

        return createAdmin
    })

    return result;
}

export const userService = {
    createAdminIntoDB
}