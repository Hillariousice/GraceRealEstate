import express,{Request,Response} from 'express'
import { GeneratePassword, GenerateSalt, generateToken, adminSchema, option, } from '../utils/utils'
import User from '../model/UserModel'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from "jsonwebtoken";


export const CreateSuperadmin = async(req:JwtPayload,res:Response)=>{
    try{
        const {firstName,lastName,email,password,phone} = req.body
        const validateResult = adminSchema.validate(req.body,option)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            })
        }
        const salt = await GenerateSalt()
        // console.log(salt)
        const superadminPassword = await GeneratePassword(password,salt)
//  console.log(hashedPassword)
        const superadmin = await User.findOne({email})
        if(!superadmin){
            await User.create({
                firstName,
                lastName,
                email,
                password: superadminPassword ,
                confirm_password: superadminPassword ,
                phone,
                address:"",
                gender:"",
                salt,
                lng:0,
                lat:0,
                verified:true,
                role:"superadmin",
                coverImage:""
            })

            const superAdminExist = await User.findOne({email})
           return res.status(201).json({
                message:'User registered',
                superAdminExist
            })
        
        }

       return res.status(400).json({
        message:'Superadmin already exist',
        Error:'Superadmin already exist'
       })


    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error',
            Error: "/admins/create-superadmin"
        })
    }

}