import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { ScheduleService } from "./Schedule.service";

const insertIntoDB = catchAsync(async (req, res) => {
    const result = await ScheduleService.insertIntoDB(req.body)

    sendRespone(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Schedule is Created",
        data: result
    })
})
const getSchedules = catchAsync(async (req, res) => {
    const result = await ScheduleService.getSchedules()

    sendRespone(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Schedule is fetched",
        data: result
    })
})

export const ScheduleController = {
    insertIntoDB,
    getSchedules
}