import { Admin, Prisma } from "@prisma/client"
import { adminSearchFields } from "./admin.const";
import calculatePagination from "../../utility/pagination";
import prisma from "../../utility/prismaClient";

const getAdminFromDB = async (params: any, options: any) => {

    const { limit, orderBy, orderSort, skip, page } = calculatePagination(options)
    const { searchTerm, ...rest } = params
    const andCondition: Prisma.AdminWhereInput[] = []
    andCondition.push({
        isDeleted: false
    })
    if (searchTerm) {
        andCondition.push({
            OR: adminSearchFields.map(field => (
                {
                    [field]: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }
            ))

        })
    }
    if (Object.keys(rest).length > 0) {
        andCondition.push({
            OR: Object.keys(rest).map(field => (
                {
                    [field]: {
                        equals: rest[field],
                        mode: 'insensitive'
                    }
                }
            ))

        })
    }

    const whereCondition: Prisma.AdminWhereInput = { AND: andCondition }
    const result = await prisma.admin.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
            [orderBy]: orderSort
        }
    })
    const total = await prisma.admin.count({
        where: whereCondition
    })
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }

}
const getAdminByIdFromDB = async (id: string) => {

    const result = await prisma.admin.findMany({
        where: {
            id: id,
            isDeleted: false
        }
    })

    return result
}
const updateAdminIntoDB = async (id: string, payload: Partial<Admin>) => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id: id,
            isDeleted: false
        }
    })

    const result = await prisma.admin.update({
        where: {
            id: id
        },
        data: payload
    })

    return result
}



export const adminService = {
    getAdminFromDB,
    getAdminByIdFromDB,
    updateAdminIntoDB
}