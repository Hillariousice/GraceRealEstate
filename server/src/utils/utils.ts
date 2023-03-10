import Joi from 'joi'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerSchema = Joi.object().keys({
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),
    email:Joi.string().required(),
    phone:Joi.string().required(),
    password:Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirm_password:Joi.any().equal(Joi.ref('password')).required().label('Confirm Password').messages({"any.only":"{{label}} does not match"})
})

export const loginSchema = Joi.object().keys({
  email:Joi.string().required(),
  password:Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
})

export const updateSchema = Joi.object().keys({
  firstName:Joi.string(),
  lastName:Joi.string(),
  address:Joi.string(),
  gender:Joi.string(),
  phone:Joi.string(),
  coverImage:Joi.string()
})


export const adminSchema =Joi.object().keys({
  firstName:Joi.string().required(),
  lastName:Joi.string().required(),
  email:Joi.string().required(),
  phone:Joi.string().required(),
  password:Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
})
export const agentSchema =Joi.object().keys({
  name:Joi.string().required(),
  companyName:Joi.string().required(),
  email:Joi.string().required(),
  phone:Joi.string().required(),
  password:Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
})
export const updateAgentSchema =Joi.object().keys({
  name:Joi.string(),
  companyName:Joi.string(),
  email:Joi.string(),
  phone:Joi.string(),
  address:Joi.string(),
  pincode:Joi.string(),
  coverImage:Joi.string()
})

export const updatePropertySchema =Joi.object().keys({
  name:Joi.string(),
  description:Joi.string(),
  address:Joi.string(),
  condition:Joi.string(),
  propertySize:Joi.string(),
  price:Joi.string(),
  image:Joi.string()
})

export const option = {
    abortEarly: false,
    errors: {
      wrap: {
        label: "",
      },
    },
  };

  export const GenerateSalt = async()=>{
   return  await bcrypt.genSalt()
  }

  export const GeneratePassword = async(password:string,salt:string)=>{
    return await bcrypt.hash(password,salt)
  }

  export const generateToken = async(_id:string)=>{
    if(process.env.APP_SECRET){
      return await jwt.sign({_id},process.env.APP_SECRET,{expiresIn:'1d'})
    }
  }
