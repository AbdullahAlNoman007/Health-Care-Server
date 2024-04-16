import express from 'express'
import auth from '../../middleWare/auth'
import { UserRole } from '@prisma/client'
import { appointmentController } from './Appointment.controller'

const router = express.Router()

router.post('/create', auth(UserRole.PATIENT), appointmentController.createAppointment)

export const appointmentRouter = router;