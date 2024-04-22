import { Prisma } from "@prisma/client";
import { TdecodedData } from "../../interface"
import calculatePagination from "../../utility/pagination";
import prisma from "../../utility/prismaClient";
import { TMyScheduleFilter, TdoctorScheduleFilter } from "./doctorSchedule.interface";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";

const createDoctorSchedule = async (user: TdecodedData, payload: { scheduleIds: string[] }) => {
    const { scheduleIds } = payload;

    const isDoctorExists = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
    const doctorSchedule = scheduleIds.map(id => ({
        doctorId: isDoctorExists.id,
        scheduleId: id
    }))

    const result = await prisma.doctorSchedules.createMany({
        data: doctorSchedule
    })

    return result;
}

const getDoctorSchedule = async (params: TdoctorScheduleFilter, option: any, user: TdecodedData) => {
    const { limit, orderBy, orderSort, skip, page } = calculatePagination(option)
    const { startDate, endDate } = params;


    const andCondition = [];

    if (startDate && endDate) {
        andCondition.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDate
                    }
                },
                {
                    endDateTime: {
                        lte: endDate
                    }
                },
            ]
        })
    }
    const whereCondition: Prisma.ScheduleWhereInput = andCondition.length > 0 ? { AND: andCondition } : {}

    const schedule = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user.email
            }
        }
    })
    const doctorScheduleIds = schedule.map(item => item.scheduleId)

    const result = await prisma.schedule.findMany({
        where: {
            ...whereCondition,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy: {
            [orderBy]: orderSort
        }
    })



    const total = await prisma.schedule.count({
        where: {
            ...whereCondition,
            id: {
                notIn: doctorScheduleIds
            }
        }
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }

}

const getMySchedule = async (params: TMyScheduleFilter, option: any, user: TdecodedData) => {
    const { limit, skip, page } = calculatePagination(option)
    const { startDate, endDate, ...rest } = params;


    const andCondition: Prisma.DoctorSchedulesWhereInput[] = [];

    andCondition.push({
        doctor: {
            email: user.email
        }
    })

    if (startDate && endDate) {
        andCondition.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDate
                        }
                    }
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDate
                        }
                    }
                }
            ]
        })
    }
    if (Object.keys(rest).length > 0) {
        if (typeof rest.isBooked === 'string' && rest.isBooked === 'true') {
            rest.isBooked = true
        }
        else if (typeof rest.isBooked === 'string' && rest.isBooked === 'false') {
            rest.isBooked = true
        }
        andCondition.push({
            OR: Object.keys(rest).map(field => ({
                [field]: {
                    equals: (rest as any)[field],
                    mode: 'insensitive'
                }
            }))
        })
    }

    const whereCondition: Prisma.DoctorSchedulesWhereInput = andCondition.length > 0 ? { AND: andCondition } : {}

    const result = await prisma.doctorSchedules.findMany({
        where: whereCondition,
        skip,
        take: limit
    })



    const total = await prisma.doctorSchedules.count({
        where: whereCondition
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }

}

const deleteSchedule = async (scheduleId: string, user: TdecodedData) => {
    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const isBookedSchedule = await prisma.doctorSchedules.findUnique({
        where: {
            doctorId_scheduleId: {
                doctorId: doctor.id,
                scheduleId: scheduleId
            },
            isBooked: true
        }
    })

    if (isBookedSchedule) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can't delete paid Appoinment")
    }

    const deleteSchedule = await prisma.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctor.id,
                scheduleId: scheduleId
            }
        }
    })

    return deleteSchedule

}

export const doctorScheduleService = {
    createDoctorSchedule,
    getDoctorSchedule,
    getMySchedule,
    deleteSchedule
}