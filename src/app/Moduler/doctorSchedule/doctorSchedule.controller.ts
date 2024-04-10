import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { doctorScheduleService } from "./doctorSchedule.service";

const createDoctorSchedule = catchAsync(async (req, res) => {
    const result = await doctorScheduleService.createDoctorSchedule(req.user, req.body)
    sendRespone(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Doctor Schedules is Created",
        data: result
    })
})

export const doctorScheduleController = {
    createDoctorSchedule
}