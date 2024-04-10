import { TdecodedData } from "../../interface"
import prisma from "../../utility/prismaClient";

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

export const doctorScheduleService = {
    createDoctorSchedule
}