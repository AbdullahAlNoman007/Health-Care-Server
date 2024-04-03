import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { specialtiesService } from "./specialties.service";
import { TfileUploadInfo } from "../User/user.interface";

const createSpecialties = catchAsync(async (req, res) => {

    let file: TfileUploadInfo;

    if (req.file) {
        file = req.file
    }

    const result = await specialtiesService.createSpecialties(req.body, file?.path as string)

    sendRespone(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Specialty is Created",
        data: result
    })
})

export const specialtiesController = {
    createSpecialties
}