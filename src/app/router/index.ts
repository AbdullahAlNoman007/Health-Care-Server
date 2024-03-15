import express from 'express'
import { userRouter } from '../Moduler/User/user.router';

const router = express.Router()

const moduleRouters = [
    {
        path: '/user',
        route: userRouter
    }
]

moduleRouters?.map(route => router.use(route.path, route.route))

export default router;