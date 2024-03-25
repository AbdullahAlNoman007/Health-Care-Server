import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { userService } from "./user.service";
import { TfileUploadInfo } from "./user.interface";

const createAdmin = catchAsync(async (req, res) => {

    let file: TfileUploadInfo
    if (req.file) {
        file = req.file
    }

    const result = await userService.createAdminIntoDB(req.body, file?.path as string)

    sendRespone(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Admin is Created',
        data: result
    })
})
const createDoctor = catchAsync(async (req, res) => {

    let file: TfileUploadInfo
    if (req.file) {
        file = req.file
    }

    const result = await userService.createDoctorIntoDB(req.body, file?.path as string)

    sendRespone(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Doctor is Created',
        data: result
    })
})
const createPatient = catchAsync(async (req, res) => {

    let file: TfileUploadInfo
    if (req.file) {
        file = req.file
    }

    const result = await userService.createPatientIntoDB(req.body, file?.path as string)

    sendRespone(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Patient is Created',
        data: result
    })
})

export const userController = {
    createAdmin,
    createDoctor,
    createPatient
}