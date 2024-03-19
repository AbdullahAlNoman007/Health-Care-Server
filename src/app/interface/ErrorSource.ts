export type TerrorSource = {
    path: string | number;
    message: string
}[]

export type TgenaratedRespone = {
    success: boolean;
    message: string;
    errorSource: TerrorSource
}