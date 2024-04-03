import { z } from "zod";

const createSpecialtiesValidation = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is Required' })
    })
})

export const specialtiesValidation = {
    createSpecialtiesValidation
}