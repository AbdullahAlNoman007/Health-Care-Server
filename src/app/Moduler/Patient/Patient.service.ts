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

    const { patientHealthData, medicalReport, ...rest } = payload
    await prisma.patient.findUniqueOrThrow({
        where: {
            id
        }
    })

    await prisma.$transaction(async (tx) => {

        await tx.patient.update({
            where: {
                id,
                isDeleted: false
            },
            data: rest
        })

        if (medicalReport) {
            await tx.medicalReport.create({
                data: { patientId: id, ...medicalReport }
            })
        }
        if (patientHealthData) {
            await tx.patientHealthData.upsert({
                where: {
                    patientId: id
                },
                update: patientHealthData,
                create: { ...patientHealthData, patientId: id }
            })
        }
    })

    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            PatientHealthData: true,
            MedicalReport: true
        }
    })
    return patientInfo

}
const deletePatient = async (id: string) => {
    const result = await prisma.$transaction(async (tx) => {

        await tx.medicalReport.deleteMany({
            where: {
                patientId: id
            }
        })

        await tx.patientHealthData.delete({
            where: {
                patientId: id
            }
        })

        const deletePatient = await tx.patient.delete({
            where: {
                id
            }
        })

        await tx.user.delete({
            where: {
                email: deletePatient.email
            }
        })

        return deletePatient
    })

    return result
}
const softDeletePatient = async (id: string) => {
    await prisma.patient.findUniqueOrThrow({
        where: {
            id
        }
    })

    const result = await prisma.$transaction(async (tx) => {
        const deletePatient = await tx.patient.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        })

        await prisma.user.update({
            where: {
                email: deletePatient.email
            },
            data: {
                status: 'BLOCKED'
            }
        })

        return deletePatient
    })

    return result
}

export const patientService = {
    getPatient,
    getPatientById,
    updatePatient,
    deletePatient,
    softDeletePatient
}