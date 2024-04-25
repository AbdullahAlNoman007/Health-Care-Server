import { AppointmentStatus, Prisma } from "@prisma/client";
import { TdecodedData } from "../../interface";
import calculatePagination from "../../utility/pagination";
import prisma from "../../utility/prismaClient";
import { v4 as uuidv4 } from 'uuid';
import AppError from "../../Error/AppError";
import httpStatus from "http-status";

interface Tappointment {
    doctorId: string;
    scheduleId: string;
}

interface TgetAppointment {
    status?: string;
    paymentStatus?: string;
}

const createAppointment = async (payload: Tappointment, user: TdecodedData) => {
    const { doctorId, scheduleId } = payload;

    const patient = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: doctorId
        }
    })

    await prisma.schedule.findUniqueOrThrow({
        where: {
            id: scheduleId
        }
    })

    await prisma.doctorSchedules.findUniqueOrThrow({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorId,
                scheduleId: scheduleId
            },
            isBooked: false
        }
    })
    const videoCallingId = uuidv4();

    const result = await prisma.$transaction(async (tx) => {
        const createAppointment = await tx.appointment.create({
            data: {
                patientId: patient.id,
                doctorId,
                scheduleId,
                videoCallingId
            },
            include: {
                patient: true,
                doctor: true,
                schedule: true
            }
        })

        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId,
                    scheduleId
                }
            },
            data: {
                isBooked: true,
                appointmentId: createAppointment.id
            }
        })

        await tx.payment.create({
            data: {
                appointtmentId: createAppointment.id,
                amount: doctor.appointmentFee
            }
        })

        return createAppointment
    })

    return result
}

const getMyAppointment = async (params: TgetAppointment, options: any, user: TdecodedData) => {
    const { limit, skip, page } = calculatePagination(options)
    const { ...rest } = params;


    const andCondition: Prisma.AppointmentWhereInput[] = [];
    if (user.role === 'DOCTOR') {
        andCondition.push({
            doctor: {
                email: user.email
            }
        })
    }
    else if (user.role === 'PATIENT') {
        andCondition.push({
            patient: {
                email: user.email
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

    const whereCondition: Prisma.AppointmentWhereInput = { AND: andCondition }

    const result = await prisma.appointment.findMany({
        where: whereCondition,
        skip,
        take: limit,
        include: {
            doctor: true,
            schedule: true
        }
    })

    const total = await prisma.appointment.count({ where: whereCondition })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }

}
const getAppointment = async (params: TgetAppointment, options: any) => {
    const { limit, skip, page } = calculatePagination(options)
    const { ...rest } = params;


    const andCondition: Prisma.AppointmentWhereInput[] = [];

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

    const whereCondition: Prisma.AppointmentWhereInput = { AND: andCondition }

    const result = await prisma.appointment.findMany({
        where: whereCondition,
        skip,
        take: limit,
        include: {
            doctor: true,
            schedule: true
        }
    })

    const total = await prisma.appointment.count({ where: whereCondition })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }

}

const changeAppointmentStatus = async (appointmentId: string, statusData: { status: AppointmentStatus }, user: TdecodedData) => {

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId
        },
        include: {
            doctor: true
        }
    })

    if (user.role === 'DOCTOR') {
        if (appointmentData.doctor.email !== user.email) {
            throw new AppError(httpStatus.BAD_REQUEST, "You can't change other doctor appoinment")
        }
    }


    if (Object.keys(statusData).length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Provide the new status")
    }
    if (appointmentData.status === 'CANCELED') {
        throw new AppError(httpStatus.BAD_REQUEST, "Canceled Appointment can't be updated")
    }
    if (appointmentData.status === 'COMPLETED') {
        throw new AppError(httpStatus.BAD_REQUEST, "The Appointment is Completed")
    }
    if (appointmentData.status === 'SCHEDULED' && statusData.status === 'COMPLETED') {
        throw new AppError(httpStatus.BAD_REQUEST, "Scheduled Appointment can't be directly updated to Completed")
    }
    if (appointmentData.status === 'INPROGRESS' && statusData.status === 'SCHEDULED') {
        throw new AppError(httpStatus.BAD_REQUEST, "In-progress Appointment can't be updated to SCHEDULED")
    }


    const result = await prisma.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status: statusData?.status
        }
    })
    return result
}

export const appointmentService = {
    createAppointment,
    getMyAppointment,
    getAppointment,
    changeAppointmentStatus
}