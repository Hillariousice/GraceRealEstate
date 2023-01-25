import express from 'express'
import path from 'path'
import logger from 'morgan'
import  dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import {connectDB} from './config/db'
import UserRoutes from './routes/User'
import AdminRoutes from './routes/Admin'
import AgentRoutes from './routes/Agent'


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


app.listen(process.env.PORT,()=>{console.log(`app running on ${process.env.PORT}`)})

export default app