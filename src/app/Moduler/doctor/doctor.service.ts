import { Prisma } from "@prisma/client";
import prisma from "../../utility/prismaClient";
import { TdoctorData } from "./doctor.interface"
import { doctorSearchableFields } from "./doctor.const";
import calculatePagination from "../../utility/pagination";

const getDoctor = async (params: TdoctorData, options: any) => {
    const { limit, orderBy, orderSort, skip, page } = calculatePagination(options)
    const { searchTerm, ...rest } = params;

    const andCondition: Prisma.DoctorWhereInput[] = [];
    andCondition.push({
        isDeleted: false
    })
    if (searchTerm) {
        andCondition.push({
            OR: doctorSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(rest).length > 0) {
        andCondition.push({
            OR: Object.keys(rest).map(field => ({
                [field]: {
                    equals: (rest as any)[field],
                    mode: 'insensitive'
                }
            }))
        })
    }

    const whereCondition: Prisma.DoctorWhereInput = { AND: andCondition }

    const result = await prisma.doctor.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
            [orderBy]: orderSort
        }
    })

    const total = await prisma.doctor.count()

    return {
        meta: {
            total,
            page,
            limit
        },
        data: { ...result }
    }
}

const getDoctorById = async () => {

}

const updateDoctor = async () => {

}

const deleteDoctor = async () => {

}

const softdeleteDoctor = async () => {

}

export const doctorService = {
    getDoctor,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    softdeleteDoctor
}