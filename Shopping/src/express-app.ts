import express from "express";
import cors from "cors";
import logger from "morgan";
import { Shopping, appEvent } from "./api";


export const expressApp = async (app: express.Application) => {
  app.use(express.json());
  
  app.use(logger("dev"));

  app.use(cors());
 

  appEvent(app)
  //Api
   Shopping(app)

};
 