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

export const authController = {
    login
}