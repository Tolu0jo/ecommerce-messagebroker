import {hash,genSalt,compare} from "bcryptjs"
import {verify,sign} from "jsonwebtoken"
import { APP_SECRET } from "../config"
import { Request } from "express"
export const GenerateSalt= async()=>{
    return await genSalt()
}

export const GeneratePassword=(password:string,salt:string)=>{
   return hash(password, salt)
};


export const validatePassword = async(enteredPassword:string, savedPassword: string, salt:string)=>{
    return await GeneratePassword(enteredPassword,salt) === savedPassword
}
 

export const GenerateSignature = (payload:string|object|Buffer) =>{
    return sign(payload,APP_SECRET,{expiresIn:"1d"})

}

export const formatData =(data:any)=>{
    if(data){
        return data
    }
    throw new Error('Data not found');
}


export const validateSignature = async(req:Request | any)=>{
    try {
      const signature = await req.get("Authorization")
      const payload = verify(signature.split(" ")[1],APP_SECRET)
      req.user = payload;
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }  
  }