import express from 'express'
import { doctorScheduleController } from './doctorSchedule.controller'
import auth from '../../middleWare/auth';
import { UserRole } from '@prisma/client';

const router = express.Router()

router.post('/create', auth(UserRole.DOCTOR), doctorScheduleController.createDoctorSchedule)
router.get('/get', auth(UserRole.DOCTOR), doctorScheduleController.getDoctorSchedule)
router.get('/get-my', auth(UserRole.DOCTOR), doctorScheduleController.getMySchedule)
router.delete('/:id', auth(UserRole.DOCTOR), doctorScheduleController.deleteSchedule)

export const doctorScheduleRouter = router;