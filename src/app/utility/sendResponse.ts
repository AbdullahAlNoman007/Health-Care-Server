import { Response } from "express"

type Tmeta = {
    page: number;
    limit: number;
    total: number
}

type data<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    meta?: Tmeta;
    data: T;
}

const sendRespone = <T>(res: Response, data: data<T>) => {
    res.status(data?.statusCode).json({
        success: data?.success,
        message: data?.message,
        meta: data.meta,
        data: data?.data
    })
}

export default sendRespone;