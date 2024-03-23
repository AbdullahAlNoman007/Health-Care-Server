import express from 'express'
import validateRequest from '../../middleWare/validationRequest'
import { loginValidation, passwordValidation } from './auth.validation'
import { authController } from './auth.controller'
import { UserRole } from '@prisma/client'
import auth from '../../middleWare/auth'

const router = express.Router()

router.post('/login', validateRequest(loginValidation), authController.login)
router.post('/change-password', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), validateRequest(passwordValidation), authController.changePassword)
router.post('/refreshToken', authController.refreshToken)

export const authRouter = router