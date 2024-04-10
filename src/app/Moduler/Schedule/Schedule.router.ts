import express from 'express'
import { ScheduleController } from './Schedule.controller'
import auth from '../../middleWare/auth'
import { UserRole } from '@prisma/client'

const router = express.Router()

router.post('/create', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), ScheduleController.insertIntoDB)
router.get('/get', ScheduleController.getSchedules)

export const ScheduleRouter = router;