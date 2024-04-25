import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { paymentService } from "./payment.service";

const initPayment = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await paymentService.initPayment(id);
    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment initiate Successfully",
        data: result
    })
})
const validatePayment = catchAsync(async (req, res) => {
    const result = await paymentService.validatePayment(req.query);
    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment is Successfully",
        data: result
    })
})

export const paymentController = {
    initPayment,
    validatePayment
}