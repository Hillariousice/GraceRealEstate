import express,{Request,Response} from 'express'
import { GeneratePassword, GenerateSalt, generateToken, loginSchema, option, registerSchema, updateSchema } from '../utils/utils'
import User from '../model/UserModel'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from "jsonwebtoken";




export const Register = async(req:Request,res:Response)=>{
     try{
        const {firstName,lastName,email,password,confirm_password,phone} = req.body
        const validateResult = registerSchema.validate(req.body,option)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            })
        }

        const salt = await GenerateSalt()
        // console.log(salt)
        const hashedPassword = await GeneratePassword(password,salt)
//  console.log(hashedPassword)
        const user = await User.findOne({email})
        if(!user){
            await User.create({
                firstName,
                lastName,
                email,
                password:hashedPassword,
                confirm_password:hashedPassword,
                phone,
                address:"",
                gender:"",
                salt,
                lng:0,
                lat:0,
                verified:false,
                role:"user",
                coverImage:""
            })

            const userExist = await User.findOne({email})
           return res.status(201).json({
                message:'User registered',
                userExist
            })
        
        }

       res.status(400).json({
        message:'User already exist',
        Error:'User already exist'
       })

     }catch(err){
        res.status(500).json({
            message:'Internal Server Error',
            Error: "/users/signin"
        })
     }
}

export const Login = async(req:Request,res:Response)=>{
    try{
        const {email,password}= req.body
        const validateResult = loginSchema.validate(req.body,option)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            })
        }
        const user = await User.findOne({email})
        if(user){
            const validate = await bcrypt.compare(password,user.password)
            if(validate){
                const token = await generateToken(`${user._id}`)
                res.cookie('token',token)
                return res.status(200).json({
                    message:'User logged in',
                   role:user.role,
                   email:user.email,
                   verified:user.verified,
                })
            }
        }
        return res.status(400).json({
            Error: "Wrong Username or password or not a verified user ",
          });
    }catch(err){
        res.status(500).json({
            message:'Internal Server Error',
            Error: "/users/login"
        })
    }
}


export const getAllUsers = async(req:Request,res:Response)=>{
    try{
        const users = await User.find({})
        res.status(200).json({
            message:"Here Is All Users",
            users
        })
    }catch(err){
        res.status(500).json({
            message:'Internal Server Error',
            Error: "/users/get-all-users"
        })
    }
}

export const userGet = async(req:Request,res:Response)=>{
try{
    const id= req.params._id
     const user = await User.findOne({_id:id})
    if(user){
        res.status(200).json({
            message:'Here Is Your User',
            user
         })
    }
    return res.status(400).json({
        message: "User not found",
      });
}catch(err){
    res.status(500).json({
        message:'Internal Server Error',
        Error: "/users/get-all-users/:_id"
    })
}
}

export const userUpdate = async(req:JwtPayload,res:Response)=>{
    try{
        const id = req.params._id
        const{firstName,lastName,address,gender,phone,coverImage}= req.body
        const validateResult = updateSchema.validate(req.body,option)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            })
        }
        const user = await User.findOne({_id:id})
        if(!user){
            return res.status(400).json({
                Error: "You are not authorized to update your profile",
              });
        }
        const updatedUser = await User.findOneAndUpdate({_id:id},{
            firstName,lastName,address,gender,phone,
            coverImage:req.file.path
        })
        if(updatedUser){
            const user = await User.findOne({_id:id})
            res.status(200).json({
                message:'User updated',
                user
            })
        }
        return res.status(400).json({
            message: "Error occurred",
          });
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error',
            Error: "/users/updateUser/:_id"
        })
    }
}


export const userDelete = async(req:Request,res:Response)=>{
try{
    const id = req.params._id
    const user = await User.findByIdAndDelete({_id:id})
    if(user){
        return res.status(200).json({
            message:'User deleted successfully'
           
        })
    }
}catch(err){
    return res.status(500).json({
        message:'Internal Server Error',
        Error: "/users/deleteUser/:_id"
    })
}
}