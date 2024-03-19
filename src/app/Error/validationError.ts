import mongoose from "mongoose";

const handleValidationError = (err: mongoose.Error.ValidationError) => {
    const statusCode = 400
    const errorSource = [{
        path: err.errors.name.path,
        message: err.errors.name.message
    }]
    return {
        statusCode,
        errorSource
    }
}
export default handleValidationError