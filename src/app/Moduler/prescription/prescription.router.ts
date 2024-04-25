import express from 'express'
import { prescriptionController } from './prescription.controller'
import auth from '../../middleWare/auth'
import { UserRole } from '@prisma/client'

const router = express.Router()

router.post('/', auth(UserRole.DOCTOR), prescriptionController.insertIntoDB)

export const prescriptionRouter = router