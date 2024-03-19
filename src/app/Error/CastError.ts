import mongoose from "mongoose";

const handleCastError = (err: mongoose.Error.CastError) => {
    const statusCode = 400;
    const errorSource = [{
        path: err.path,
        message: err.message
    }]
    return {
        statusCode,
        errorSource
    }

}
export default handleCastError