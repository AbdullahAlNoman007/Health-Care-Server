import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { userService } from "./user.service";
import { TfileUploadInfo } from "./user.interface";
import pick from "../../utility/pick";
import { adminPaginationFields } from "../admin/admin.const";
import { userFilterField } from "./user.const";
import { UserStatus } from "@prisma/client";

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

const changeStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const status: UserStatus = req.body
    const result = await userService.changeStatus(id, status)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User status is changed',
        data: result
    })
})

const getMyProfile = catchAsync(async (req, res) => {

    const result = await userService.getMyProfile(req.user)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile's is fetched",
        data: result
    })
})

const updateProfile = catchAsync(async (req, res) => {

    let file: TfileUploadInfo
    if (req.file) {
        file = req.file
    }

    const result = await userService.updateProfile(req.body || {}, req.user, file?.path as string)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile is update",
        data: result
    })
})


export const userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUser,
    changeStatus,
    getMyProfile,
    updateProfile
}