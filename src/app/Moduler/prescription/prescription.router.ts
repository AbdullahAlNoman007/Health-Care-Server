import express from 'express'
import { prescriptionController } from './prescription.controller'
import auth from '../../middleWare/auth'
import { UserRole } from '@prisma/client'

const router = express.Router()

router.post('/', auth(UserRole.DOCTOR), prescriptionController.insertIntoDB)
router.get('/patient-prescription', auth(UserRole.PATIENT), prescriptionController.patientPrescriptions)
router.get('/get-prescription', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), prescriptionController.getAllFromDB)
router.get('/get-prescription/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), prescriptionController.getById)

export const prescriptionRouter = router