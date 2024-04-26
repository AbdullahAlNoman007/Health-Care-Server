import express from 'express'
import auth from '../../middleWare/auth'
import { UserRole } from '@prisma/client'
import { metaController } from './meta.controller'

const router = express.Router()

router.get('/', auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN), metaController.getPatient)

export const metaRouter = router