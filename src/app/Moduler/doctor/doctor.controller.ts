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
    const { id } = req.params
    const result = await doctorService.getDoctorById(id)

    sendRespone(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctor data is retrived successfully",
        data: result
    })
})

const updateDoctor = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await doctorService.updateDoctor(id, req.body)

    sendRespone(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctor is updated",
        data: result
    })
})

const deleteDoctor = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await doctorService.deleteDoctor(id)

    sendRespone(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctor is Deleted",
        data: result
    })
})

const softdeleteDoctor = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await doctorService.softdeleteDoctor(id)

    sendRespone(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Doctor is deleted softly",
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