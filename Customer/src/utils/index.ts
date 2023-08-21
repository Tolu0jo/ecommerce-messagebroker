import {hash,genSalt,compare} from "bcryptjs"
import {verify,sign} from "jsonwebtoken"
import { APP_SECRET, EXCHANGE_NAME, MESSAGE_BROKER_URL, QUEUE_NAME } from "../config"
import { Request } from "express"
import amqp from "amqplib"
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

  //message broker

//create channel
export const CreateChannel = async()=>{
    try {
      const connection = await amqp.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange (EXCHANGE_NAME,"direct",{ durable: true });
  return channel;
    } catch (error) {
      console.log(error);
    }
  }

  //subscribe messages
  export const SubscribeMessage= async(channel:any,service:any,binding_key:any)=>{
  try {
    const appQueue = await channel.assetQueue(QUEUE_NAME);
    channel.bindQueue(appQueue.queue,EXCHANGE_NAME,binding_key);
    channel.consume(appQueue.queue,(data:any)=>{
      console.log("recieved data: ")
      console.log(data.content.toString());
      service.SubscriberEvents(data.content.toString())
      channel.ack(data)
    })
  } catch (error) {
    
  }
    
  }