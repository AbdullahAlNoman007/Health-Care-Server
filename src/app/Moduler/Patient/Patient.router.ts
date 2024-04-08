import express from 'express'
import auth from '../../middleWare/auth'
import { UserRole } from '@prisma/client'
import { patientController } from './Patient.controller'

const router = express.Router()

router.get('/get-patient', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), patientController.getPatient)
router.get('/get-patient/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), patientController.getPatientById)
router.patch('/update-patient/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), patientController.updatePatient)
router.delete('/delete-patient/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), patientController.deletePatient)
router.delete('/soft-delete-patient/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), patientController.softDeletePatient)

export const patientRouter = router;