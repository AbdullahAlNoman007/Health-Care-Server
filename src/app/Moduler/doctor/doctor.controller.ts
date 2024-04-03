import httpStatus from "http-status"
import sendRespone from "../../utility/sendResponse"
import catchAsync from "../../utility/trycatch"
import { doctorService } from "./doctor.service"
import pick from "../../utility/pick"
import { doctorFilterableFields, doctorPaginationFields } from "./doctor.const"

const getDoctor = catchAsync(async (req, res) => {

    const params = pick(req.query, doctorFilterableFields)
    const pagination = pick(req.query, doctorPaginationFields)
    const result = await doctorService.getDoctor(params, pagination)

    sendRespone(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctor data is retrived successfully",
        meta: result.meta,
        data: result.data
    })
})

const getDoctorById = catchAsync(async (req, res) => {
    const result = await doctorService.getDoctorById()

    sendRespone(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "",
        data: result
    })
})

const updateDoctor = catchAsync(async (req, res) => {
    const result = await doctorService.updateDoctor()

    sendRespone(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "",
        data: result
    })
})

const deleteDoctor = catchAsync(async (req, res) => {
    const result = await doctorService.deleteDoctor()

    sendRespone(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "",
        data: result
    })
})

const softdeleteDoctor = catchAsync(async (req, res) => {
    const result = await doctorService.softdeleteDoctor()

    sendRespone(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "",
        data: result
    })
})

export const doctorController = {
    getDoctor,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    softdeleteDoctor
}