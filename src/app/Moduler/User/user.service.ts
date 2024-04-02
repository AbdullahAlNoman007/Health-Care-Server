import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { Tadmin, Tdoctor, Tpatient, TuserQuery } from "./user.interface";
import bcrypt from 'bcrypt'
import prisma from "../../utility/prismaClient";
import config from "../../config";
import { fileUploader } from "../../utility/sendImage";
import { TCloudinaryImage, TdecodedData } from "../../interface";
import { userSearchField } from "./user.const";
import calculatePagination from "../../utility/pagination";

const createAdminIntoDB = async (payload: Tadmin, path: string) => {
    let ImageData;
    const hashPassword = await bcrypt.hash(payload.password, Number(config.hash_salt_round as string))

    if (path) {
        ImageData = await fileUploader.uploadImage(path) as TCloudinaryImage
    }

    if (ImageData) {
        payload.admin.profilePhoto = ImageData.secure_url
    }

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
const createDoctorIntoDB = async (payload: Tdoctor, path: string) => {
    let ImageData;
    const hashPassword = await bcrypt.hash(payload.password, Number(config.hash_salt_round as string))

    if (path) {
        ImageData = await fileUploader.uploadImage(path) as TCloudinaryImage
    }

    if (ImageData) {
        payload.doctor.profilePhoto = ImageData.secure_url
    }
    const userData = {
        email: payload.doctor.email,
        password: hashPassword,
        role: UserRole.DOCTOR
    }
    const result = await prisma.$transaction(async (tx) => {
        await tx.user.create({
            data: userData
        })

        const createDoctor = await tx.doctor.create({
            data: payload.doctor
        })
        return createDoctor
    })

    return result;
}
const createPatientIntoDB = async (payload: Tpatient, path: string) => {

    let ImageData;
    const hashPassword = await bcrypt.hash(payload.password, Number(config.hash_salt_round as string))

    if (path) {
        ImageData = await fileUploader.uploadImage(path) as TCloudinaryImage
    }

    if (ImageData) {
        payload.patient.profilePhoto = ImageData.secure_url
    }

    const userData = {
        email: payload.patient.email,
        password: hashPassword,
        role: UserRole.PATIENT
    }
    const result = await prisma.$transaction(async (tx) => {
        await tx.user.create({
            data: userData
        })

        const createPatient = await tx.patient.create({
            data: payload.patient
        })
        return createPatient
    })

    return result;
}

const getAllUser = async (payload: TuserQuery, options: any) => {
    const { limit, orderBy, orderSort, skip, page } = calculatePagination(options)
    const searchField: Prisma.UserWhereInput[] = []
    const { searchTerm, ...rest } = payload;
    if (searchTerm) {
        searchField.push(
            {
                OR: userSearchField.map(field => ({
                    [field]: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }))
            })

    }
    if (Object.keys(rest).length > 0) {
        searchField.push({
            OR: Object.keys(rest).map(field => ({
                [field]: {
                    equals: (rest as any)[field],
                    mode: 'insensitive'
                }
            }))
        })
    }

    const andCondition: Prisma.UserWhereInput = {
        AND: searchField
    }

    const result = await prisma.user.findMany({
        where: andCondition,
        skip,
        take: limit,
        orderBy: {
            [orderBy]: orderSort
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            Admin: true,
            Patient: true,
            Doctor: true
        }
    })

    const total = await prisma.user.count()

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}

const changeStatus = async (id: string, status: UserStatus) => {

    await prisma.user.findUniqueOrThrow({
        where: {
            id: id
        }
    })
    const updateResult = await prisma.user.update({
        where: {
            id: id
        },
        data: status,
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    })

    return updateResult


}

const getMyProfile = async (decode: TdecodedData) => {
    const role = decode.role;
    let userProfile;
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: decode.email,
            role: role,
            status: 'ACTIVE'
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true
        }
    })

    if (role === 'ADMIN') {
        userProfile = await prisma.admin.findUniqueOrThrow({
            where: {
                email: decode.email,
                isDeleted: false
            }
        })
    }
    else if (role === 'DOCTOR') {
        userProfile = await prisma.doctor.findUniqueOrThrow({
            where: {
                email: decode.email,
                isDeleted: false
            }
        })
    }
    else if (role === 'PATIENT') {
        userProfile = await prisma.patient.findUniqueOrThrow({
            where: {
                email: decode.email,
                isDeleted: false
            }
        })
    }
    else if (role === 'SUPER_ADMIN') {
        userProfile = await prisma.admin.findUniqueOrThrow({
            where: {
                email: decode.email,
                isDeleted: false
            }
        })
    }

    return { ...user, ...userProfile }

}

export const userService = {
    createAdminIntoDB,
    createDoctorIntoDB,
    createPatientIntoDB,
    getAllUser,
    changeStatus,
    getMyProfile
}