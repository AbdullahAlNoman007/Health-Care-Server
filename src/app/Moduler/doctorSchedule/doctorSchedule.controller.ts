import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { doctorScheduleService } from "./doctorSchedule.service";
import pick from "../../utility/pick";
import { PaginationFields, doctorScheduleFilter } from "./doctorSchedule.const";

const createDoctorSchedule = catchAsync(async (req, res) => {
    const result = await doctorScheduleService.createDoctorSchedule(req.user, req.body)
    sendRespone(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Doctor Schedules is Created",
        data: result
    })
})
const getDoctorSchedule = catchAsync(async (req, res) => {
    const query = pick(req.query, doctorScheduleFilter)
    const option = pick(req.query, PaginationFields)

    const result = await doctorScheduleService.getDoctorSchedule(query, option, req.user)
    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Schedules is fetched",
        meta: result.meta,
        data: result.data
    })
})
const getMySchedule = catchAsync(async (req, res) => {
    const query = pick(req.query, ['startDate', 'endDate', 'isBooked'])
    const option = pick(req.query, PaginationFields)

    const result = await doctorScheduleService.getMySchedule(query, option, req.user)
    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Schedules is fetched",
        meta: result.meta,
        data: result.data
    })
})

export const doctorScheduleController = {
    createDoctorSchedule,
    getDoctorSchedule,
    getMySchedule
}