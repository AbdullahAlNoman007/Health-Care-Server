import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { adminService } from "./admin.service";
import pick from "../../utility/pick";
import { adminFilterFields, adminPaginationFields } from "./admin.const";


const getAdmin = catchAsync(async (req, res) => {

    const filter = pick(req.query, adminFilterFields)
    const options = pick(req.query, adminPaginationFields)

    const result = await adminService.getAdminFromDB(filter, options)

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