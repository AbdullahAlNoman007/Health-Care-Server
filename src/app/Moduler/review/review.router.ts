import express from 'express'
import auth from '../../middleWare/auth'
import { UserRole } from '@prisma/client'
import { reviewController } from './review.controller'

const router = express.Router()

router.post('/', auth(UserRole.PATIENT), reviewController.createReview)
router.get('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), reviewController.getReview)

export const reviewRouter = router;