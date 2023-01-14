import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
         const conn = await mongoose.connect('mongodb://localhost:27017/gracerealestate',()=>{
            console.log(`MongoDB is connected`)
         })
    }catch(err){
        console.log(err)
    }
}

export const APP_SECRET = process.env.APP_SECRET!