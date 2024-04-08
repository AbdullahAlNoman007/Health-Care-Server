import { Prisma } from "@prisma/client";
import calculatePagination from "../../utility/pagination";
import { IPatientFilterRequest, IPatientUpdate } from "./Patient.interface"
import { patientSearchableFields } from "./Patient.const";
import prisma from "../../utility/prismaClient";

const getPatient = async (params: IPatientFilterRequest, options: any) => {
    const { limit, orderBy, orderSort, skip, page } = calculatePagination(options)
    const { searchTerm, ...rest } = params;


    const andCondition: Prisma.PatientWhereInput[] = [];
    andCondition.push({
        isDeleted: false
    })
    if (searchTerm) {
        andCondition.push({
            OR: patientSearchableFields.map(field => ({
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

    const whereCondition: Prisma.PatientWhereInput = { AND: andCondition }

    const result = await prisma.patient.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
            [orderBy]: orderSort
        },
        include: {
            PatientHealthData: true,
            MedicalReport: true
        }
    })

    const total = await prisma.patient.count()

    return {
        meta: {
            total,
            page,
            limit
        },
        data: { ...result }
    }

}
const getPatientById = async (id: string) => {
    const result = await prisma.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })
    return result
}
const updatePatient = async (id: string, payload: Partial<IPatientUpdate>) => {

}
const deletePatient = async (id: string) => {

}
const softDeletePatient = async (id: string) => {

}

export const patientService = {
    getPatient,
    getPatientById,
    updatePatient,
    deletePatient,
    softDeletePatient
}