import express from 'express'
import { ScheduleController } from './Schedule.controller'

const router = express.Router()

router.post('/create', ScheduleController.insertIntoDB)

export const ScheduleRouter = router;