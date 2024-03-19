import { Prisma } from "@prisma/client"
import { adminSearchFields } from "./admin.const";
import calculatePagination from "../../utility/pagination";
import prisma from "../../utility/prismaClient";




const getAdminFromDB = async (params: any, options: any) => {

    const { limit, orderBy, orderSort, skip } = calculatePagination(options)
    const { searchTerm, ...rest } = params
    const andCondition: Prisma.AdminWhereInput[] = []

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
    return result

}



export const adminService = {
    getAdminFromDB
}