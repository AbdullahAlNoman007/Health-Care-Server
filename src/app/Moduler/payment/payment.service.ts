import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../utility/prismaClient";
import { SSLService } from "../SSL/ssl.service";
import { PaymentStatus } from "@prisma/client";

const initPayment = async (id: string) => {

    const payment = await prisma.payment.findUniqueOrThrow({
        where: {
            id: id
        },
        include: {
            appointment: {
                include: {
                    patient: true
                }
            }
        }
    })

    const initPaymentData = {
        amount: payment.amount,
        transactionId: payment.transactionId,
        name: payment.appointment.patient.name,
        email: payment.appointment.patient.email,
        address: payment.appointment.patient.address,
        contactNumber: payment.appointment.patient.contactNumber
    }

    const paymentResult = await SSLService.initPaymentSSL(initPaymentData);

    return {
        paymentURL: paymentResult.GatewayPageURL
    }


}

const validatePayment = async (payload: any) => {
    if (!payload || !payload.status || !(payload.status === 'VALID')) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid Payment")
    }

    const response = await SSLService.validatePayment(payload)

    if (response?.status !== 'VALID') {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment Failed!")
    }

    await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.update({
            where: {
                transactionId: response.tran_id
            },
            data: {
                status: PaymentStatus.PAID,
                paymentGatewayData: response
            }
        })
        await tx.appointment.update({
            where: {
                id: payment.appointtmentId
            },
            data: {
                paymentStatus: PaymentStatus.PAID
            }
        })
    })

    return {
        message: "Payment Success!"
    }
}

export const paymentService = {
    initPayment,
    validatePayment
}