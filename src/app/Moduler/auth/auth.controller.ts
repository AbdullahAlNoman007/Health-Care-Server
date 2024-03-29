import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { authService } from "./auth.service";


const login = catchAsync(async (req, res) => {
    const result = await authService.loginInDB(req.body)

    res.cookie('refreshToken', result.refreshToken, {
        secure: false,
        httpOnly: true
    });

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User logged in',
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange
        }
    })
})
const refreshToken = catchAsync(async (req, res) => {

    const result = await authService.refreshToken(req.cookies)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User logged in',
        data: result
    })
})

const changePassword = catchAsync(async (req, res) => {

    const result = await authService.changePassword(req.user, req.body)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password Changed',
        data: result
    })
})
const forgetPassword = catchAsync(async (req, res) => {

    const result = await authService.forgetPassword(req.body)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reset Link is send successfully',
        data: result
    })
})
const resetPassword = catchAsync(async (req, res) => {

    const token = req.headers.authorization || "";
    const result = await authService.resetPassword(token, req.body)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password is Reset',
        data: result
    })
})


export const authController = {
    login,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword
}