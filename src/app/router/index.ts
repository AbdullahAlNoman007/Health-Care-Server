import express from 'express'
import { userRouter } from '../Moduler/User/user.router';
import { adminRouter } from '../Moduler/admin/admin.router';
import { authRouter } from '../Moduler/auth/auth.router';
import { specialtiesRoute } from '../Moduler/Specialties/specialties.router';
import { doctorRouter } from '../Moduler/doctor/doctor.router';
import { patientRouter } from '../Moduler/Patient/Patient.router';
import { ScheduleRouter } from '../Moduler/Schedule/Schedule.router';
import { doctorScheduleRouter } from '../Moduler/doctorSchedule/doctorSchedule.router';
import { appointmentRouter } from '../Moduler/Appointment/Appointment.router';
import { paymentRouter } from '../Moduler/payment/payment.router';
import { prescriptionRouter } from '../Moduler/prescription/prescription.router';
import { reviewRouter } from '../Moduler/review/review.router';
import { metaRouter } from '../Moduler/meta/meta.router';

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
    {
        path: '/schedule',
        route: ScheduleRouter
    },
    {
        path: '/doctorSchedule',
        route: doctorScheduleRouter
    },
    {
        path: '/appointment',
        route: appointmentRouter
    },
    {
        path: '/payment',
        route: paymentRouter
    },
    {
        path: '/prescription',
        route: prescriptionRouter
    },
    {
        path: '/review',
        route: reviewRouter
    },
    {
        path: '/meta',
        route: metaRouter
    }
]

moduleRouters?.map(route => router.use(route.path, route.route))

export default router;