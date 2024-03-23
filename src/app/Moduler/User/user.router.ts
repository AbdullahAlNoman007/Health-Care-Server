import express from 'express'
import { userController } from './user.controller'
import { UserRole } from '@prisma/client'
import auth from '../../middleWare/auth'

const router = express.Router()

router.post('/create-admin', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), userController.createAdmin)

export const userRouter = router