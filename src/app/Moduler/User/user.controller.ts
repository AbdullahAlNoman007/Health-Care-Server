import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { userService } from "./user.service";

const createAdmin = catchAsync(async (req, res) => {
    const result = await userService.createAdminIntoDB()

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