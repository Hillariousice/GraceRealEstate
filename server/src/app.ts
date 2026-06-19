import express from 'express'
import path from 'path'
import logger from 'morgan'
import  dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import {connectDB} from './config/db'
import UserRoutes from './routes/User'
import AdminRoutes from './routes/Admin'
import AgentRoutes from './routes/Agent'
import cors from 'cors';


const app = express()
dotenv.config()
connectDB()


//middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.static(path.join(process.cwd(),'./public')))


//Routes
app.use('/users',UserRoutes)
app.use('/admins',AdminRoutes)
app.use('/agents',AgentRoutes)
app.use(cors({
    origin: ['https://grace-real-estate.vercel.app', 'http://localhost:5173'], // Allow your Vercel frontend and local development
    credentials: true // Crucial if you are using cookies for tokens
}));


app.listen(process.env.PORT,()=>{console.log(`app running on ${process.env.PORT}`)})

export default app