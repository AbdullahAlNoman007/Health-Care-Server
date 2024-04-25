import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import router from './app/router';
import notFound from './app/middleWare/notFound';
import globalErrorHandle from './app/middleWare/globalErrorHandle';
import cookieParser from 'cookie-parser';
import config from './app/config';
import cron from 'node-cron'
import { appointmentService } from './app/Moduler/Appointment/Appointment.service';


const app: Application = express();

app.use(cors())
app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: `Health Care server... ${config.node_env} Mode`
    })
})

cron.schedule('* * * * *', () => {
    try {
        appointmentService.cancelUnPaidAppointments()
    } catch (error: any) {
        throw new Error(error)
    }
});

app.use(globalErrorHandle)
app.use(notFound)

export default app;