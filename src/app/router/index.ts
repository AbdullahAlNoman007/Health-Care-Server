import express from 'express'
import { userRouter } from '../Moduler/User/user.router';
import { adminRouter } from '../Moduler/admin/admin.router';
import { authRouter } from '../Moduler/auth/auth.router';
import { specialtiesRoute } from '../Moduler/Specialties/specialties.router';

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
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/specialties',
        route: specialtiesRoute
    },
]

moduleRouters?.map(route => router.use(route.path, route.route))

export default router;