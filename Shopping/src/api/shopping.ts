import express, { Response, Request, NextFunction } from "express";
import userAuth from "./middleware/auth";
import ShoppingService from "../services/shopping-service";
//import { PublishCustomerEvent } from "../utils";
import { Channel } from "amqplib";
import { PublishMesage, SubscribeMessage } from "../utils";
import { CUSTOMER_BINDING_KEY } from "../config";

export const Shopping = (app: express.Application,channel: Channel | undefined) => {
  const service = new ShoppingService();
  
  SubscribeMessage(channel, service)

  app.get("/cart", userAuth, async (req: Request | any, res: Response) => {
    try {
      const { _id } = req.user;
      const cart = await service.GetCart(_id);
      if (cart) return res.status(200).json(cart);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  //PLACE ORDER
  app.post("/order", userAuth, async (req: Request | any, res: Response) => {
    try {
      const { _id } = req.user;
      const { transactionId } = req.body;
      const order = await service.PlaceOrder({ _id, transactionId });
      const payload = await service.GetOrderPayload(_id, order, "CREATE_ORDER");

      // PublishCustomerEvent(JSON.stringify(payload));
      PublishMesage(channel, CUSTOMER_BINDING_KEY,JSON.stringify(payload))  
      if (order) return res.status(201).json(order);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  //GET ORDERS
  app.get("/orders", userAuth, async (req: Request | any, res: Response) => {
    try {
      const { _id } = req.user;
      const order = await service.GetOrder(_id);
      const totalPrice = order.reduce((total:number ,order:{amount:number})=> total + order.amount,0)
      if (order) return res.status(200).json({order,totalPrice});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" })
    }
  });
};
