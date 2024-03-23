import { z } from "zod";

export const loginValidation = z.object({
    body: z.object({
        email: z.string(),
        password: z.string()
    })
})
export const passwordValidation = z.object({
    body: z.object({
        oldPassword: z.string(),
        newPassword: z.string(),
    })
})
export const forgetpasswordValidation = z.object({
    body: z.object({
        email: z.string()
    })
})