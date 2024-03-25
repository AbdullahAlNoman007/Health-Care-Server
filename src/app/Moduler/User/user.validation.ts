import { z } from "zod";

const Gender = z.enum(['MALE', 'FEMALE']);

const adminCreateValidationSchema = z.object({
    body: z.object({
        password: z.string(),
        admin: z.object({
            name: z.string(),
            email: z.string().email(),
            contactNumber: z.string(),
        })
    })
})

const patientCreateValidationSchema = z.object({
    body: z.object({
        password: z.string(),
        admin: z.object({
            name: z.string(),
            email: z.string().email(),
            contactNumber: z.string(),
            address: z.string(),
        })
    })
})


const doctorCreateValidationSchema = z.object({
    body: z.object({
        password: z.string(),
        doctor: z.object({
            name: z.string(),
            email: z.string().email(),
            contactNumber: z.string(),
            address: z.string(),
            registrationNumber: z.string(),
            experience: z.number().default(0),
            gender: Gender,
            appointmentFee: z.number(),
            qualification: z.string(),
            currentWorkingPlace: z.string(),
            designation: z.string(),
            averageRating: z.number().default(1)
        })
    })
})



export const userValidation = {
    adminCreateValidationSchema,
    doctorCreateValidationSchema,
    patientCreateValidationSchema
}