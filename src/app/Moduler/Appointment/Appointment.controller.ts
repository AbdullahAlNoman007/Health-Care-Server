import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { appointmentService } from "./Appointment.service";

const createAppointment = catchAsync(async (req, res) => {
    const result = await appointmentService.createAppointment(req.body, req.user)
    sendRespone(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Appointment is Created",
        data: result
    })
})

export const appointmentController = {
    createAppointment
}