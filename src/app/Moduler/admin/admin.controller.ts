import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { adminService } from "./admin.service";

const getAdmin = catchAsync(async (req, res) => {
    const result = await adminService.getAdminFromDB(req.query)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin data is retrived successfully',
        data: result

    })
})

export const adminController = {
    getAdmin
}