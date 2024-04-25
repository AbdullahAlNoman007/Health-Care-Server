import { PaymentStatus, Prescription } from "@prisma/client";
import { TdecodedData } from "../../interface";
import prisma from "../../utility/prismaClient";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";

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

export const prescriptionService = {
    insertIntoDB
}