import prisma from "../../utility/prismaClient";
import { SSLService } from "../SSL/ssl.service";

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
    console.log('hii');

}

export const paymentService = {
    initPayment,
    validatePayment
}