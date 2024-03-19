import { z } from "zod";

export const adminUpdateValidation = z.object({
    body: z.object({
        name: z.string().optional(),
        contactNumber: z.string().optional()
    })
})