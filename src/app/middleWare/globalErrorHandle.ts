import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { TerrorSource } from "../interface/ErrorSource";
import { ZodError } from "zod";
import handleZodError from "../Error/zodError";
import AppError from "../Error/AppError";
import { Prisma } from "@prisma/client";
import handlePrismaValidationError from "../Error/PrismaValidationError";

const globalErrorHandle: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {


    let statusCode = err.statusCode || 500;
    let Message = err.message || "Something Went wrong"
    let errorSource: TerrorSource = [{
        path: '',
        message: 'Something Went wrong'
    }]

    if (err instanceof ZodError) {
        const simpleError = handleZodError(err);
        statusCode = simpleError.statusCode;
        errorSource = simpleError.errorSource;
        Message = 'It is a Zod validation Error'
    }
    else if (err instanceof AppError) {
        statusCode = err?.statusCode;
        Message = err?.message;
        errorSource = [
            {
                path: '',
                message: err?.message
            }
        ]
    }
    else if (err instanceof Error) {
        Message = err?.message;
        errorSource = [
            {
                path: '',
                message: err?.message
            }
        ]
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
        const simpleError = handlePrismaValidationError(err);
        statusCode = simpleError.statusCode;
        errorSource = simpleError.errorSource;
        Message = simpleError.Message;

    }

    return res.status(statusCode).json({
        success: false,
        message: Message,
        errorSource
    })
}
export default globalErrorHandle