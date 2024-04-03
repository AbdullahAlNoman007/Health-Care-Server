import express, { NextFunction, Request, Response } from 'express'
import { fileUploader } from '../../utility/sendImage'
import validateRequest from '../../middleWare/validationRequest'
import { specialtiesValidation } from './specialties.validation'
import { specialtiesController } from './specialties.controller'

const router = express.Router()

router.post(
    '/',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(specialtiesValidation.createSpecialtiesValidation),
    specialtiesController.createSpecialties
)

router.get(
    '/',
    specialtiesController.getSpecialties
)

router.delete('/:id', specialtiesController.deleteSpecialties)

export const specialtiesRoute = router;