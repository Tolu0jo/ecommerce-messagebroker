import { hash, genSalt } from "bcryptjs";
import { verify, sign } from "jsonwebtoken";
import { APP_SECRET } from "../config";
import { NextFunction } from "express";
import axios from "axios";

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

export const PublishCustomerEvent = async (payload: any) => {
  await axios.post("http://localhost:8000/app-events", { payload });
};
export const PublishShoppingEvent = async (payload: any) => {
  await axios.post("http://localhost:8000/shopping/app-events", { payload });
};
