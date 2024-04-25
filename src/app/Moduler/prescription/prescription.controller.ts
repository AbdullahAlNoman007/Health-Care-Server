import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { prescriptionService } from "./prescription.service";

const insertIntoDB = catchAsync(async (req, res) => {
    const result = await prescriptionService.insertIntoDB(req.user, req.body)

    sendRespone(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Prescription is created",
        data: result
    })
})

export const prescriptionController = {
    insertIntoDB
}