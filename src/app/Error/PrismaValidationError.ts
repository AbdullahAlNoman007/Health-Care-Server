import { Prisma } from "@prisma/client";
import httpStatus from "http-status";

const handlePrismaValidationError = (err: Prisma.PrismaClientValidationError) => {

    const statusCode = httpStatus.NOT_FOUND;
    const Message = err.name;

    const errorMessage = err.message;
    const start_index = errorMessage.indexOf("Unknown argument");
    const end_index = errorMessage.indexOf("?", start_index) + 1;
    const extractedMessage = start_index !== -1 && end_index !== -1 ? errorMessage.substring(start_index, end_index).trim() : "Error message not found";

    const errorSource = [
        {
            path: '',
            message: errorMessage
        }
    ];

    return {
        statusCode,
        Message,
        errorSource
    }
}

export default handlePrismaValidationError;