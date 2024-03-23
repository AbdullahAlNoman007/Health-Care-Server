import httpStatus from "http-status";
import AppError from "../Error/AppError";
import catchAsync from "../utility/trycatch";
import { jwtDecode } from "jwt-decode";
import prisma from "../utility/prismaClient";
import { TdecodedData } from "../Moduler/auth/auth.interface";

const auth = (...roles: string[]) => {

    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Please Put the Access Token")
        }
        const decoded = jwtDecode(token) as TdecodedData
        await prisma.user.findUniqueOrThrow({
            where: {
                email: decoded.email,
                status: 'ACTIVE'
            }
        })
        if (roles.length <= 0) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized")
        }

        if (!roles.includes(decoded.role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized")
        }
        req.user = decoded;


        next()
    })

}
export default auth;