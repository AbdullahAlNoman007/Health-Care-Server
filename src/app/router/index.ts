import express from 'express'
import { userRouter } from '../Moduler/User/user.router';
import { adminRouter } from '../Moduler/admin/admin.router';

const router = express.Router()

const moduleRouters = [
    {
        path: '/user',
        route: userRouter
    },
    {
        path: '/admin',
        route: adminRouter
    },
]

moduleRouters?.map(route => router.use(route.path, route.route))

export default router;