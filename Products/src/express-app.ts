import express from "express";
import cors from "cors";
import logger from "morgan";
import { Product,appEvent } from "./api";

export const expressApp = async (app: express.Application) => {
  app.use(express.json());
  
  app.use(logger("dev"));

  app.use(cors());
 
  //handleEvent
  appEvent(app)

  //Api
  Product(app)

};
 