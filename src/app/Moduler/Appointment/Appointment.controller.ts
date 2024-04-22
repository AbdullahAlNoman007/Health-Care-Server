import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { appointmentService } from "./Appointment.service";
import pick from "../../utility/pick";

const createAppointment = catchAsync(async (req, res) => {
    const result = await appointmentService.createAppointment(req.body, req.user)
    sendRespone(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Appointment is Created",
        data: result
    })
})
const getMyAppointment = catchAsync(async (req, res) => {

    const params = pick(req.query, ["status", "paymentStatus"])
    const pagination = pick(req.query, ['page', 'limit', 'orderBy', 'orderSort'])

    const result = await appointmentService.getMyAppointment(params, pagination, req.user)
    sendRespone(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My Appointment is fetched",
        data: result
    })
})
const getAppointment = catchAsync(async (req, res) => {

    const params = pick(req.query, ["status", "paymentStatus"])
    const pagination = pick(req.query, ['page', 'limit', 'orderBy', 'orderSort'])

    const result = await appointmentService.getAppointment(params, pagination)
    sendRespone(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Appointment is fetched",
        data: result
    })
})

export const appointmentController = {
    createAppointment,
    getMyAppointment,
    getAppointment
}