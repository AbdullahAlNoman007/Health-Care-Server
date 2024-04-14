import { Prisma } from "@prisma/client";
import prisma from "../../utility/prismaClient";
import { TdoctorData } from "./doctor.interface"
import { doctorSearchableFields } from "./doctor.const";
import calculatePagination from "../../utility/pagination";

const getDoctor = async (params: TdoctorData, options: any) => {
    const { limit, orderBy, orderSort, skip, page } = calculatePagination(options)
    const { searchTerm, specialtie, ...rest } = params;


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

    if (specialtie && specialtie.length > 0) {
        andCondition.push({
            DoctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialtie,
                            mode: 'insensitive'
                        }
                    }
                }
            }
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
        },
        include: {
            DoctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    })

    const total = await prisma.doctor.count({ where: whereCondition })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: { ...result }
    }
}

const getDoctorById = async (id: string) => {
    const result = await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })

    return result
}

const updateDoctor = async (id: string, payload: any) => {
    const { specialties, ...doctorData } = payload;

    await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    })

    await prisma.$transaction(async (tx) => {

        await tx.doctor.update({
            where: {
                id
            },
            data: doctorData
        })

        if (specialties && specialties.length > 0) {

            const deleteSpecialties = specialties.filter((specialty: any) => specialty.isDeleted)
            const createSpecialties = specialties.filter((specialty: any) => !specialty.isDeleted)

            for (const specialty of deleteSpecialties) {
                await tx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: id,
                        specialitiesId: specialty.id
                    }
                })

            }

            for (const specialty of createSpecialties) {
                await tx.doctorSpecialties.create({
                    data: {
                        doctorId: id,
                        specialitiesId: specialty.id
                    }
                })

            }


        }

    })

    const result = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            DoctorSpecialties: true
        }
    })

    return result
}

const deleteDoctor = async (id: string) => {

    await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })

    const result = await prisma.doctor.delete({
        where: {
            id
        }
    })
    return result
}

const softdeleteDoctor = async (id: string) => {

    await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })

    const result = await prisma.doctor.update({
        where: {
            id
        },
        data: {
            isDeleted: true
        }
    })
}

export const doctorService = {
    getDoctor,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    softdeleteDoctor
}