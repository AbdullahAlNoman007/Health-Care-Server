import express from 'express'
import { adminController } from './admin.controller'
import validateRequest from '../../middleWare/validationRequest'
import { adminUpdateValidation } from './admin.validation'
import auth from '../../middleWare/auth'
import { UserRole } from '@prisma/client'

const router = express.Router()

router.get('/get-admin', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), adminController.getAdmin)
router.get('/get-admin/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), adminController.getAdminById)
router.patch('/update-admin/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(adminUpdateValidation), adminController.updateAdmin)
router.delete('/delete-admin/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), adminController.deleteAdmin)
router.delete('/soft-delete-admin/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), adminController.softdeleteAdmin)

export const adminRouter = router;