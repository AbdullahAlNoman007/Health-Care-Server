import { Prisma, PrismaClient } from "@prisma/client"
import { adminSearchFields } from "./admin.const";



const prisma = new PrismaClient()

const getAdminFromDB = async (params: any, options: any) => {

    const { page, limit } = options
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
        skip: (Number(page) - 1) * limit,
        take: Number(limit)
    })
    return result

}

export const adminService = {
    getAdminFromDB
}