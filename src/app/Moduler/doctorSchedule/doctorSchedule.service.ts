import { Prisma } from "@prisma/client";
import { TdecodedData } from "../../interface"
import calculatePagination from "../../utility/pagination";
import prisma from "../../utility/prismaClient";
import { TdoctorScheduleFilter } from "./doctorSchedule.interface";

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

const getDoctorSchedule = async (params: any, option: any, user: TdecodedData) => {
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
                        gte: endDate
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



    const total = await prisma.schedule.count({ where: whereCondition })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }

}

export const doctorScheduleService = {
    createDoctorSchedule,
    getDoctorSchedule
}