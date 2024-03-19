import express from 'express'
import { adminController } from './admin.controller'
import validateRequest from '../../middleWare/validationRequest'
import { adminUpdateValidation } from './admin.validation'

const router = express.Router()

router.get('/get-admin', adminController.getAdmin)
router.get('/get-admin/:id', adminController.getAdminById)
router.patch('/update-admin/:id', validateRequest(adminUpdateValidation), adminController.updateAdmin)

export const adminRouter = router;