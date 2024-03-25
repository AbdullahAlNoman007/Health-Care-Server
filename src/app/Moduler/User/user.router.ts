import express from 'express'
import { userController } from './user.controller'
import { UserRole } from '@prisma/client'
import auth from '../../middleWare/auth'
import validateRequest from '../../middleWare/validationRequest'
import { userValidation } from './user.validation'

const router = express.Router()

router.post(
    '/create-admin',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(userValidation.adminCreateValidationSchema),
    userController.createAdmin)

export const userRouter = router