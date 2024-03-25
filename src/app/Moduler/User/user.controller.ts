import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { userService } from "./user.service";
import { TfileUploadInfo } from "./user.interface";
import pick from "../../utility/pick";
import { adminPaginationFields } from "../admin/admin.const";
import { userFilterField } from "./user.const";

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

const getAllUser = catchAsync(async (req, res) => {

    const filter = pick(req.query, userFilterField)
    const options = pick(req.query, adminPaginationFields)

    const result = await userService.getAllUser(filter, options)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User data is retrieved',
        meta: result.meta,
        data: result.data
    })
})


export const userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUser
}