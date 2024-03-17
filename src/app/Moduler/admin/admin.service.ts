import { Prisma, PrismaClient } from "@prisma/client"



const prisma = new PrismaClient()

const getAdminFromDB = async (params: any) => {
    const { searchTerm, ...rest } = params
    const andCondition: Prisma.AdminWhereInput[] = []
    const searchFields = ['name', 'email', 'contactNumber']

    if (searchTerm) {
        andCondition.push({
            OR: searchFields.map(field => (
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
        where: whereCondition
    })
    return result

}

export const adminService = {
    getAdminFromDB
}