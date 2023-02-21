import React, { createContext, ReactElement, useContext, useState } from 'react';
// import {apiPost} from '../utils/axios';
import { toast } from 'react-toastify';
import axios, { AxiosRequestConfig } from 'axios';
import { apiGet } from '../utils/axios';
import { config } from 'dotenv';


const baseUrl = "http://localhost:4020";

interface Register {
  
    firstName?: string;
    lastName?:string;
    email?: string;
    password?: string;
    confirm_password?: string;

}

interface Login {
  
    email?: string;
    password?: string;

}

interface AuthContext {
  RegisterConfig: (data: Register) => Promise<void>;
  LoginConfig: (data: Login) => Promise<void>;
  getAllProperty:()=>Promise<void>;
}

const DataContext = createContext<AuthContext | null>(null);



const DataProvider = ({ children }: { [key: string]: ReactElement }) => {
 const [getAgentProperty,setGetAgentProperty]= useState([])
  



  const RegisterConfig = async (formData : Register) => {
    try {
      const registerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
      };

      const config: AxiosRequestConfig = {
        headers: {
        Authorization:` Bearer ${localStorage.getItem('signature')}`,
        },
        };

      await axios.post(`${baseUrl}/users/register`, registerData,config).then((res:any) => {
        console.log(res.data);
        toast.success(res.data.message);
        localStorage.setItem('signature', res.data.signature);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      });
    } catch (err:any) {
      console.log(err);
      toast.error(err.response.data.Error);
    }
  };

  

  const LoginConfig = async ( formData : Login) => {
    try {
      const LoginData = {
        email: formData.email,
        password: formData.password,
      };
      const config: AxiosRequestConfig = {
        headers: {
        Authorization:` Bearer ${localStorage.getItem('signature')}`,
        },
        };
      await axios.post(`${baseUrl}/users/login`, LoginData, config).then((res:any) => {
        console.log(res.data);
        toast.success(res.data.message);
        localStorage.setItem('signature', res.data.signature);

        setTimeout(() => {
          if (res.data.role === 'agent'|| res.data.role === 'admin') {
            window.location.href = '/dashboard';
          } else if (res.data.role === 'author') {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/';
          }
        }, 2000);
      });
    } catch (err:any) {
      console.log(err);
      toast.error(err.response.data.Error);
    }
  };

const getAllProperty = async ()=>{
  try{
    await axios.get(`${baseUrl}/agents/get-all-property`).then((res:any)=>{
        setGetAgentProperty([]);
    })
  }catch(err){
console.log(err)
  }
}

  return (
   <DataContext.Provider value={{ RegisterConfig, LoginConfig,getAllProperty }} >
   {children}
   </DataContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(DataContext);
  // console.log(context)
  if (!context) {
    throw new Error('useAuth must be used within the auth provider');
  }
  return context;
};

export default DataProvider;
