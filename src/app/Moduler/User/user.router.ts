import express, { NextFunction, Request, Response } from 'express'
import { userController } from './user.controller'
import { UserRole } from '@prisma/client'
import auth from '../../middleWare/auth'
import validateRequest from '../../middleWare/validationRequest'
import { userValidation } from './user.validation'
import { fileUploader } from '../../utility/sendImage'

const router = express.Router()

router.post(
    '/create-admin',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(userValidation.adminCreateValidationSchema),
    userController.createAdmin)


router.post(
    '/create-doctor',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(userValidation.doctorCreateValidationSchema),
    userController.createDoctor)

router.post(
    '/create-patient',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(userValidation.patientCreateValidationSchema),
    userController.createPatient)

router.get('/get-user', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), userController.getAllUser)
router.patch('/change-status/:id', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(userValidation.changeStatudValidationSchema), userController.changeStatus)

router.get('/get-profile', auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN), userController.getMyProfile)

export const userRouter = router