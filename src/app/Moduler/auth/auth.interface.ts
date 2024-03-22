export interface Tlogin {
    email: string;
    password: string;
}

export interface TdecodedData {
    email: string;
    role: string;
    iat: number;
    exp: number;
}