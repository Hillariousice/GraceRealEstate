import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

 const MONGO_URL=process.env.MONGO_URL

export const connectDB = async()=>{
    try{
         const conn = await mongoose.connect(process.env.MONGO_URL!,()=>{
            console.log(`MongoDB is connected`)
         })
    }catch(err){
        console.log(err)
    }
}

export const APP_SECRET = process.env.APP_SECRET!