import { z } from "zod";

export const loginValidation = z.object({
    body: z.object({
        email: z.string(),
        password: z.string()
    })
})