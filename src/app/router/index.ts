import express from 'express'
import { userRouter } from '../Moduler/User/user.router';
import { adminRouter } from '../Moduler/admin/admin.router';
import { authRouter } from '../Moduler/auth/auth.router';
import { specialtiesRoute } from '../Moduler/Specialties/specialties.router';
import { doctorRouter } from '../Moduler/doctor/doctor.router';
import { patientRouter } from '../Moduler/Patient/Patient.router';

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
    {
        path: '/doctor',
        route: doctorRouter
    },
    {
        path: '/patient',
        route: patientRouter
    },
]

moduleRouters?.map(route => router.use(route.path, route.route))

export default router;