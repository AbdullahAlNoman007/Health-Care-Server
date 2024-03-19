import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { TerrorSource } from "../interface/ErrorSource";
import { ZodError } from "zod";
import handleZodError from "../Error/zodError";
import handleValidationError from "../Error/validationError";
import handleCastError from "../Error/CastError";
import handleDuplicateError from "../Error/duplicateError";
import AppError from "../Error/AppError";
import { Prisma } from "@prisma/client";

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
    else if (err.name === 'ValidationError') {
        const simpleError = handleValidationError(err);
        statusCode = simpleError.statusCode;
        errorSource = simpleError.errorSource;
        Message = 'It is a Schema validation Error'
    }
    else if (err.name === 'CastError') {
        const simpleError = handleCastError(err);
        statusCode = simpleError.statusCode;
        errorSource = simpleError.errorSource;
        Message = 'It is a Cast Error'
    }
    else if (err.code === 11000) {
        const simpleError = handleDuplicateError(err);
        statusCode = simpleError.statusCode;
        errorSource = simpleError.errorSource;
        Message = 'It is a duplicate Error'
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
        statusCode = 500;
        Message = err.name;
        const errorMessage = err.message;
        const start_index = errorMessage.indexOf("Unknown argument");
        const end_index = errorMessage.indexOf("?", start_index) + 1;
        const extractedMessage = start_index !== -1 && end_index !== -1 ? errorMessage.substring(start_index, end_index).trim() : "Error message not found";

        errorSource = [
            {
                path: '',
                message: extractedMessage
            }
        ];

    }
    if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = 500;
        Message = err.name;
        const errorMessage = err.message;
        const start_index = errorMessage.indexOf("Unknown argument");
        const end_index = errorMessage.indexOf("?", start_index) + 1;
        const extractedMessage = start_index !== -1 && end_index !== -1 ? errorMessage.substring(start_index, end_index).trim() : "Error message not found";

        errorSource = [
            {
                path: '',
                message: extractedMessage
            }
        ];

    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = 500;
        Message = err.name;
        const errorMessage = err.message;
        const start_index = errorMessage.indexOf("Unknown argument");
        const end_index = errorMessage.indexOf("?", start_index) + 1;
        const extractedMessage = start_index !== -1 && end_index !== -1 ? errorMessage.substring(start_index, end_index).trim() : "Error message not found";

        errorSource = [
            {
                path: '',
                message: extractedMessage
            }
        ];

    }
    if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = 500;
        Message = err.name;
        const errorMessage = err.message;
        const start_index = errorMessage.indexOf("Unknown argument");
        const end_index = errorMessage.indexOf("?", start_index) + 1;
        const extractedMessage = start_index !== -1 && end_index !== -1 ? errorMessage.substring(start_index, end_index).trim() : "Error message not found";

        errorSource = [
            {
                path: '',
                message: extractedMessage
            }
        ];

    }
    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        Message = err.name;
        const errorMessage = err.message;
        const start_index = errorMessage.indexOf("Unknown argument");
        const end_index = errorMessage.indexOf("?", start_index) + 1;
        const extractedMessage = start_index !== -1 && end_index !== -1 ? errorMessage.substring(start_index, end_index).trim() : "Error message not found";

        errorSource = [
            {
                path: '',
                message: extractedMessage
            }
        ];

    }

    return res.status(statusCode).json({
        success: false,
        message: Message,
        errorSource
    })
}
export default globalErrorHandle