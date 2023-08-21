import { verify} from "jsonwebtoken";
import { APP_SECRET, CUSTOMER_BINDING_KEY, EXCHANGE_NAME, MESSAGE_BROKER_URL, QUEUE_NAME } from "../config";
import amqp from "amqplib"

export const formatData = (data: any) => {
  if (data) {
    return data;
  }
  throw new Error("Data not found");
};

export const validateSignature = async (req: Request | any) => {
  try {
    const signature = await req.get("Authorization");

    const payload = verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

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
//publish messages
export const PublishMesage = async(channel:any,binding_key:string,message:any)=>{
  try {
    await channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));
  } catch (error) {
    console.log(error);
  }
}
//subscribe messages
export const SubscribeMessage= async(channel:any,service:any)=>{
try {
  const appQueue = await channel.assetQueue(QUEUE_NAME);
  channel.bindQueue(appQueue.queue,EXCHANGE_NAME,CUSTOMER_BINDING_KEY);
  channel.consume(appQueue.queue,(data:any)=>{
    console.log("recieved data: ")
    console.log(data.content.toString());
    channel.ack(data)
  })
} catch (error) {
  
}
  
}
