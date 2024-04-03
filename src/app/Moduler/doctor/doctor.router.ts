import express from 'express'
import auth from '../../middleWare/auth'
import { UserRole } from '@prisma/client'
import { doctorController } from './doctor.controller'

const router = express.Router()

router.get('/get-doctor', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), doctorController.getDoctor)
router.get('/get-doctor/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), doctorController.getDoctorById)
router.patch('/update-doctor/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), doctorController.updateDoctor)
router.delete('/delete-doctor/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), doctorController.deleteDoctor)
router.delete('/soft-delete-doctor/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), doctorController.softdeleteDoctor)


export const doctorRouter = router