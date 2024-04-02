import { UserRole } from "@prisma/client";

export interface TdecodedData {
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}