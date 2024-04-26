import httpStatus from "http-status"
import sendRespone from "../../utility/sendResponse"
import catchAsync from "../../utility/trycatch"
import { metaService } from "./meta.service"

const getPatient = catchAsync(async (req, res) => {

    const result = await metaService.getDashBoardMeta(req.user)

    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "DashBoard Data is Retrived",
        data: result
    })
})

export const metaController = {
    getPatient
}