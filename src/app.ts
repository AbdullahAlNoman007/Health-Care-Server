import express, { Application, Request, Response, urlencoded } from 'express'
import cors from 'cors'
import router from './app/router';
import notFound from './app/middleWare/notFound';

const app: Application = express();

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Health Care server..."
    })
})


app.use(notFound)

export default app;