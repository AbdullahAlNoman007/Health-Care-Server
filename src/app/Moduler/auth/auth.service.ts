import httpStatus from "http-status"
import AppError from "../../Error/AppError"
import prisma from "../../utility/prismaClient"
import { Tlogin } from "./auth.interface"
import bcrypt from 'bcrypt'
import token from "../../utility/Token"
import config from "../../config"
import { jwtDecode } from "jwt-decode"
import { TdecodedData } from "../../interface"

const loginInDB = async (payload: Tlogin) => {
    const isUserExists = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: 'ACTIVE'
        }
    })

    const isPasswordMatched = bcrypt.compareSync(payload.password, isUserExists.password)
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password doesn't match")
    }

    const jwtPayload = {
        email: isUserExists.email,
        role: isUserExists.role
    }

    const accessToken = token(jwtPayload, config.jwt_access_token as string, config.jwt_access_expires_in as string)

    const refreshToken = token(jwtPayload, config.jwt_refresh_token as string, config.jwt_refresh_expires_in as string)

    return {
        accessToken,
        refreshToken,
        needPasswordChange: isUserExists.needPasswordChange
    };


}

const refreshToken = async (payload: { refreshToken: string }) => {

    let decoded: TdecodedData
    try {
        decoded = jwtDecode(payload.refreshToken)
    } catch (error) {
        throw new AppError(httpStatus.BAD_REQUEST, "Your Refresh Token is Invalid. Please Login again")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decoded.email,
            status: 'ACTIVE'
        }
    })

    const jwtPayload = {
        email: userData.email,
        role: userData.role
    }

    const accessToken = token(jwtPayload, config.jwt_access_token as string, config.jwt_access_expires_in as string)

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    }

}

const changePassword = async (decoded: TdecodedData, payload: { oldPassword: string; newPassword: string }) => {
    console.log(decoded);
    console.log(payload);

    const userData = await prisma.user.findUnique({
        where: {
            email: decoded.email,
            status: 'ACTIVE'
        }
    })

    const checkPassword = bcrypt.compareSync(payload.oldPassword, userData?.password as string)

    if (!checkPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "Old password doesn't matched")
    }

    const hashPassword = await bcrypt.hash(payload.newPassword, config.salt_round as string)

    const updatePassword = await prisma.user.update({
        where: {
            email: decoded.email
        },
        data: {
            password: hashPassword,
            needPasswordChange: true
        }
    })

    if (!updatePassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "Fail to update Password")
    }
    return {
        message: 'Password Changed Successfully!!!'
    }

}

export const authService = {
    loginInDB,
    refreshToken,
    changePassword
}