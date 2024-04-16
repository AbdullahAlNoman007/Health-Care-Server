import { TdecodedData } from "../../interface";
import prisma from "../../utility/prismaClient";
import { v4 as uuidv4 } from 'uuid';

interface Tappointment {
    doctorId: string;
    scheduleId: string;
}

const createAppointment = async (payload: Tappointment, user: TdecodedData) => {
    const { doctorId, scheduleId } = payload;

    const patient = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    await prisma.doctor.findUniqueOrThrow({
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

    const result = await prisma.appointment.create({
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

    return result
}

export const appointmentService = {
    createAppointment
}