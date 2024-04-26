import httpStatus from "http-status";
import sendRespone from "../../utility/sendResponse";
import catchAsync from "../../utility/trycatch";
import { reviewService } from "./review.service";
import pick from "../../utility/pick";

const createReview = catchAsync(async (req, res) => {
    const result = await reviewService.createReview(req.body, req.user)
    sendRespone(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review is created",
        data: result
    })
})
const getReview = catchAsync(async (req, res) => {
    const params = pick(req.query, ['doctor', 'patient'])
    const pagination = pick(req.query, [
        'page',
        'limit',
        'sortBy',
        'sortOrder'
    ])
    const result = await reviewService.getAllFromDB(params, pagination)
    sendRespone(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Review is fetched",
        data: result
    })
})

export const reviewController = {
    createReview,
    getReview
}