import {Request, Response,NextFunction} from 'express'
import jwt,{JwtPayload} from 'jsonwebtoken'
import {APP_SECRET} from "../config/db";
import User from '../model/UserModel';

export const auth = async(req:JwtPayload,res:Response,next:NextFunction)=>{
try{
    const authorization = req.headers.authorization

    if(!authorization){
        return res.status(401).json({
            Error:"Kindly login"
        })
    }
    // console.log(authorization)
   // Bearer erryyyygccffxfx
   const token = authorization.slice(7, authorization.length);
//    console.log(token)
    let verified = jwt.verify(token,'howgreatiam') 
// console.log(verified)
    if(!verified){
        return res.status(401).json({
            Error:"unauthorized"
        })
    }
   
  
    const {_id} = verified as {[key:string]:string}
// console.log(id)
     // find the user by id
     const user = await User.findOne({_id:_id})
console.log(user)
     if(!user){
        return res.status(401).json({
            Error:"Invalid Credentials"
        })
     } 

   req.user = verified;
    // console.log(req.user)
   next()
}catch(err){
    return res.status(401).json({
        Error:'Unauthorized'
       })
}
}