import { JwtPayload } from "jsonwebtoken";
import { TdecodedData } from "./interface";

declare global {
    namespace Express {
        interface Request {
            user: TdecodedData
        }
    }
}