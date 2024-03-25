import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { userService } from "./user.service";
import { TfileUploadInfo } from "./user.interface";

const createAdmin = catchAsync(async (req, res) => {
    const file: TfileUploadInfo = req.file

    const result = await userService.createAdminIntoDB(req.body, file?.path as string)

    sendRespone(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Admin is Created',
        data: result
    })
})

export const userController = {
    createAdmin
}