import express from 'express'
import { paymentController } from './payment.controller'

const router = express.Router()

router.post('/init-payment/:id', paymentController.initPayment)
router.get('/validation-payment', paymentController.validatePayment)

export const paymentRouter = router;