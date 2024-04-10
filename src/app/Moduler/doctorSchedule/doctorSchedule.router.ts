import express from 'express'
import { doctorScheduleController } from './doctorSchedule.controller'
import auth from '../../middleWare/auth';
import { UserRole } from '@prisma/client';

const router = express.Router()

router.post('/create', auth(UserRole.DOCTOR), doctorScheduleController.createDoctorSchedule)

export const doctorScheduleRouter = router;