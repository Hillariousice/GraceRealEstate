import express,{Request,Response} from 'express'
import { GeneratePassword, GenerateSalt, generateToken, adminSchema, option, agentSchema, } from '../utils/utils'
import User from '../model/UserModel'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from "jsonwebtoken";
import Agent from '../model/AgentModel';


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

export const CreateAdmin = async(req:JwtPayload, res:Response)=>{
    try{
        const _id = req.user._id
        const {firstName,lastName,email,password,phone} = req.body
        console.log(req.body)
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
        const Admin = await User.findOne({_id})
      

        if (Admin?.email === email) {
            return res.status(400).json({
              message: "Email Already exist",
            });
          }
      
          if (Admin?.phone === phone) {
            return res.status(400).json({
              message: "Phone number  already exist",
            });
          }
      
          //Create Admin
          if (Admin?.role === "superadmin") {
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
                role:"admin",
                coverImage:""
            });
      
            // check if the admin exist
            const Admin = (await User.findOne({
             _id: _id 
            })) 
      
          
      
            return res.status(201).json({
              message: "Admin created successfully",
              verified: Admin?.verified,
            });
          }
          return res.status(400).json({
            message: "Admin already exist",
          });

    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error',
            Error: "/admins/create-admin"
        }) 
    }
}
export const CreateAgent = async(req:JwtPayload, res:Response)=>{
    try{
        const _id = req.user._id
        const {name,companyName,email,password,phone} = req.body
        console.log(req.body)
        const validateResult = agentSchema.validate(req.body,option)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            })
        }
        
        const salt = await GenerateSalt()
        // console.log(salt)
        const agentPassword = await GeneratePassword(password,salt)
        const agent = await Agent.findOne({email})
        const Admin = await User.findOne({_id})

    if (Admin?.role === "admin" || Admin?.role === "superadmin") {
        if (!agent) {
          const createAgent = await Agent.create({
          
          name,
          companyName,
          pincode:"",
          phone,
          address:"",
          email,
          password: agentPassword,
          salt,
          serviceAvailable:false,
          rating:0,
          role:"agent",
          coverImage:""
          });
  
          return res.status(201).json({
            message: "Agent created successfully",
            createAgent,
          });
        }
        return res.status(400).json({
          message: "Agent already exist",
        });
      }
  
      return res.status(400).json({
        message: "unathorised",
      });

    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error',
            Error: "/admins/create-agent"
        }) 
    }
}
export const getAllAgents = async(req:Request,res:Response)=>{
  try{
      const agents = await Agent.find({})
      res.status(200).json({
          message:"Here Is All Agents",
          agents
      })
  }catch(err){
      res.status(500).json({
          message:'Internal Server Error',
          Error: "/admins/get-all-agents"
      })
  }
}

export const agentGet = async(req:Request,res:Response)=>{
try{
  const id= req.params._id
   const agent= await Agent.findOne({_id:id})
  if(agent){
      res.status(200).json({
          message:'Here Is Your User',
          agent
       })
  }
  return res.status(400).json({
      message: "Agent not found",
    });
}catch(err){
  res.status(500).json({
      message:'Internal Server Error',
      Error: "/users/get-agent"
  })
}
}
export const agentDelete = async(req:Request,res:Response)=>{
  try{
      const id = req.params._id
      const agent = await Agent.findByIdAndDelete({_id:id})
      if(agent){
          return res.status(200).json({
              message:'Agent deleted successfully'
             
          })
      }
  }catch(err){
      return res.status(500).json({
          message:'Internal Server Error',
          Error: "/admins/deleteAgent/:_id"
      })
  }
  }
