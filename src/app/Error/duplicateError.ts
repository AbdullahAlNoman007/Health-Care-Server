import mongoose from "mongoose";

const handleDuplicateError = (err: mongoose.Error.CastError) => {
    const statusCode = 400;
    const match = err.message.match(/"([^"]*)"/);
    const errorMessage = match && match[1];


    const errorSource = [{
        path: '',
        message: `${errorMessage} already exists` || " "
    }]
    return {
        statusCode,
        errorSource
    }

}
export default handleDuplicateError