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
        meta: result?.meta,
        data: result.data

    })
})
const getAdminById = catchAsync(async (req, res) => {

    const result = await adminService.getAdminByIdFromDB(req.params.id)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin data is retrived successfully',
        data: result
    })
})
const updateAdmin = catchAsync(async (req, res) => {

    const result = await adminService.updateAdminIntoDB(req.params.id, req.body)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin data is updated successfully',
        data: result
    })
})
const deleteAdmin = catchAsync(async (req, res) => {

    const result = await adminService.deleteAdminFromDB(req.params.id)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin data is deleted successfully',
        data: result
    })
})



export const adminController = {
    getAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin
}