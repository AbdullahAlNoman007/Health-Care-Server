import express from 'express'
import auth from '../../middleWare/auth'
import { UserRole } from '@prisma/client'
import { appointmentController } from './Appointment.controller'

const router = express.Router()

router.post('/create', auth(UserRole.PATIENT), appointmentController.createAppointment)
router.get('/get', auth(UserRole.PATIENT, UserRole.DOCTOR), appointmentController.getMyAppointment)
router.get('/getAll', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), appointmentController.getAppointment)
router.patch('/status/:appointmentId', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR), appointmentController.changeAppointmentStatus)

export const appointmentRouter = router;