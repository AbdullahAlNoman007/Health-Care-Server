import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { patientService } from "./Patient.service";
import pick from "../../utility/pick";
import { patientFilterableFields, patientPaginationFields } from "./Patient.const";

const getPatient = catchAsync(async (req, res) => {

    const params = pick(req.query, patientFilterableFields)
    const pagination = pick(req.query, patientPaginationFields)

    const result = await patientService.getPatient(params, pagination)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Data is Retrived",
        meta: result.meta,
        data: result.data
    })
})
const getPatientById = catchAsync(async (req, res) => {

    const { id } = req.params

    const result = await patientService.getPatientById(id as string)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Data is Retrived",
        data: result
    })
})
const updatePatient = catchAsync(async (req, res) => {
    const { id } = req.params

    const result = await patientService.updatePatient(id as string, req.body)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Data is updated",
        data: result
    })
})
const deletePatient = catchAsync(async (req, res) => {
    const { id } = req.params

    const result = await patientService.deletePatient(id as string)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Data is deleted",
        data: result
    })
})
const softDeletePatient = catchAsync(async (req, res) => {
    const { id } = req.params

    const result = await patientService.softDeletePatient(id as string)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Data is deleted softly",
        data: result
    })
})

export const patientController = {
    getPatient,
    getPatientById,
    updatePatient,
    deletePatient,
    softDeletePatient
}