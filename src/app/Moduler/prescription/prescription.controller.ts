import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { prescriptionService } from "./prescription.service";
import pick from "../../utility/pick";
import { prescriptionFilterableFields } from "./prescription.const";

const insertIntoDB = catchAsync(async (req, res) => {
    const result = await prescriptionService.insertIntoDB(req.user, req.body)

    sendRespone(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Prescription is created",
        data: result
    })
})

const patientPrescriptions = catchAsync(async (req, res) => {

    const params = pick(req.query, prescriptionFilterableFields)
    const pagination = pick(req.query, [
        'page',
        'limit',
        'sortBy',
        'sortOrder'
    ])

    const result = await prescriptionService.patientPrescriptions(req.user, params, pagination)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Prescription Data is Retrived",
        meta: result.meta,
        data: result.data
    })
})

const getAllFromDB = catchAsync(async (req, res) => {

    const params = pick(req.query, prescriptionFilterableFields)
    const pagination = pick(req.query, [
        'page',
        'limit',
        'sortBy',
        'sortOrder'
    ])

    const result = await prescriptionService.patientPrescriptions(req.user, params, pagination)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Prescription Data is Retrived",
        meta: result.meta,
        data: result.data
    })
})

const getById = catchAsync(async (req, res) => {

    const { id } = req.params

    const result = await prescriptionService.getById(id)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Prescription Data is Retrived",
        data: result
    })
})

export const prescriptionController = {
    insertIntoDB,
    patientPrescriptions,
    getAllFromDB,
    getById
}