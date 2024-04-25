import { PaymentStatus, Prescription, Prisma } from "@prisma/client";
import { TdecodedData, Tpagination } from "../../interface";
import prisma from "../../utility/prismaClient";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";
import calculatePagination from "../../utility/pagination";
import { prescriptionRelationalFields } from "./prescription.const";
import { TdoctorData } from "../doctor/doctor.interface";

const insertIntoDB = async (user: TdecodedData, payload: Partial<Prescription>) => {
    const isAppointment = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    })

    if (!(user.email === isAppointment.doctor.email)) {
        throw new AppError(httpStatus.BAD_REQUEST, "This is not Your appointment!")
    }

    const result = await prisma.prescription.create({
        data: {
            appointmentId: isAppointment.id,
            doctorId: isAppointment.doctorId,
            patientId: isAppointment.patientId,
            followUpDate: payload.followUpDate as string,
            instructions: payload.instructions as string
        }
    })

    return result
}

const patientPrescriptions = async (
    user: TdoctorData,
    filters: any,
    options: Tpagination,
) => {
    const { limit, page, skip } = calculatePagination(options);
    const { ...filterData } = filters;
    const andConditions: Prisma.PrescriptionWhereInput[] = [];
    if (user.email) {
        andConditions.push({
            patient: {
                email: user.email,
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(item => {
                if (prescriptionRelationalFields.includes(item)) {
                    return {
                        [item]: {
                            email: (filterData as any)[item]
                        }
                    }
                }
                else {
                    return {
                        [item]: {
                            equals: (filterData as any)[item]
                        }
                    }
                }
            })
        })
    }
    const whereConditions: Prisma.PrescriptionWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.prescription.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                },
        include: {
            doctor: true,
            patient: true,
            appointment: true,
        },
    });
    const total = await prisma.prescription.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};
const getAllFromDB = async (
    user: TdoctorData,
    filters: any,
    options: Tpagination,
) => {
    const { limit, page, skip } = calculatePagination(options);
    const { ...filterData } = filters;
    const andConditions: Prisma.PrescriptionWhereInput[] = [];

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(item => {
                if (prescriptionRelationalFields.includes(item)) {
                    return {
                        [item]: {
                            email: (filterData as any)[item]
                        }
                    }
                }
                else {
                    return {
                        [item]: {
                            equals: (filterData as any)[item]
                        }
                    }
                }
            })
        })
    }
    const whereConditions: Prisma.PrescriptionWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.prescription.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                },
        include: {
            doctor: true,
            patient: true,
            appointment: true,
        },
    });
    const total = await prisma.prescription.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getById = async (id: string) => {

    const result = await prisma.prescription.findUniqueOrThrow({
        where: {
            id
        }
    })
    return result
}
export const prescriptionService = {
    insertIntoDB,
    patientPrescriptions,
    getAllFromDB,
    getById
}