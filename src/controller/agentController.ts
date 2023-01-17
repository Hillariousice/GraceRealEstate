import express,{Request,Response} from 'express'
import Agent from '../model/AgentModel'
import Property from '../model/PropertyModel'
import bcrypt from 'bcryptjs'
import { JwtPayload } from "jsonwebtoken"
import { generateToken, loginSchema, option, updateAgentSchema, updatePropertySchema } from "../utils/utils"



export const agentLogin = async(req:Request,res:Response)=>{
    try{
        const {email,password}= req.body
        const validateResult = loginSchema.validate(req.body,option)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            })
        }
        const agent = await Agent.findOne({email})
        if(agent){
            const validate = await bcrypt.compare(password,agent.password)
            if(validate){
                const token = await generateToken(`${agent._id}`)
                res.cookie('token',token)
                return res.status(200).json({
                    message:'User logged in',
                   role:agent.role,
                   email:agent.email,
                })
            }
        }
        return res.status(400).json({
            Error: "Wrong agent-name or password or not a verified agent ",
          });
    }catch(err){
        res.status(500).json({
            message:'Internal Server Error',
            Error: "/agents/login"
        })
    }
}




export const agentUpdate = async(req:JwtPayload,res:Response)=>{
    try{
        const id = req.params._id
        const{name, companyName,address,email,phone,pincode,coverImage}= req.body
        const validateResult = updateAgentSchema.validate(req.body,option)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
                
            })
        }
        
        const agent = await Agent.findOne({_id:id})
        console.log(agent)
        if(!agent){
            return res.status(400).json({
                Error: "You are not authorized to update your profile",
              });
        }
        const updatedAgent = await Agent.findOneAndUpdate({_id:id},{
            name,companyName,address,email,phone,pincode,
            coverImage:req.file.path
        })
     console.log(updatedAgent)
        if(updatedAgent){
            const agent = await Agent.findOne({_id:id})
            res.status(200).json({
                message:'Agent updated',
                agent
            })
        }
        return res.status(400).json({
            message: "Error occurred",
          });
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error',
            Error: "/agents/updateAgent/:_id"
        })
    }
}


export const CreateProperty = async(req:JwtPayload,res:Response)=>{
    try{
        const _id = req.agent._id
        console.log(_id)
        const {name,description,address,category,price,image} = req.body
      
       const agent = await Agent.findOne({_id})
       if(agent){
            const createproperty =await Property.create({
            name,
            address,
            description,
            category,
            propertySize:"",
            condition:"",
            price,
            rating:0,
            agentId:_id,
            image:req.file.path
           })

          return res.status(201).json({
               message:'Property Created',
               createproperty
           })
       
       }
       return res.status(400).json({
        message: "Error occurred",
      });
    }catch(err){
       res.status(500).json({
           message:'Internal Server Error',
           Error: "/agents/create-property"
       })
    }
}

export const getAllProperty = async(req:Request,res:Response)=>{
    try{
        const property = await Property.find({})
         return res.status(200).json({
            message:"Here Is All Property",
           property
        })
    }catch(err){
         return res.status(500).json({
            message:'Internal Server Error',
            Error: "/admins/get-all-property"
        })
    }
  }
  
  export const propertyGet = async(req:Request,res:Response)=>{
  try{
    const id= req.params._id
     const agent= await Property.findOne({_id:id})
    if(agent){
        return res.status(200).json({
            message:'Here Is Your Property',
            agent
         })
    }
    return res.status(400).json({
        message: "Property not found",
      });
  }catch(err){
    res.status(500).json({
        message:'Internal Server Error',
        Error: "/users/get-property"
    })
  }
  }


  export const propertyUpdate = async(req:JwtPayload,res:Response)=>{
    try{
        const id = req.params._id
        const {name,description,address,category,price,propertySize,condition,image}= req.body
        const validateResult = updatePropertySchema.validate(req.body,option)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
                
            })
        }
        
        const property= await Property.findOne({_id:id})
        console.log(property)
        if(!property){
            return res.status(400).json({
                Error: "You are not authorized to update your profile",
              });
        }
        const updatedProperty = await Property.findOneAndUpdate({_id:id},{
            name,description,address,category,price,propertySize,condition,
            image:req.file.path
        })
     console.log(updatedProperty)
        if(updatedProperty){
            const property = await Property.findOne({_id:id})
             return res.status(200).json({
                message:'Property updated',
                property
            })
        }
        return res.status(400).json({
            message: "Error occurred",
          });
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error',
            Error: "/agents/updateProperty/:_id"
        })
    }
}



export const propertyDelete = async(req:Request,res:Response)=>{
    try{
        const id = req.params._id
        const property = await Property.findByIdAndDelete({_id:id})
        if(property){
            return res.status(200).json({
                message:'Property deleted successfully'
               
            })
        }
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error',
            Error: "/agents/deleteProperty/:_id"
        })
    }
    }

      