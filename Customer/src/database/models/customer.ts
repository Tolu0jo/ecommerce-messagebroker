import mongoose, { Schema } from "mongoose";

export interface ICustomer {
  email: string;
  password: string;
  salt: string;
  phone: string;
  cart: Array<{
    product:{
      _id: string;
      name: string;
      price: number;
      banner: string;
    },
    unit:number;
  
  }>;
  address: Array<Object>;
  wishList: Array<Object>;
  orders: Array<Object>;
}
const CustomerSchema = new Schema(
  {
    email: String,
    password: String,
    salt: String,
    phone: String,
    cart: [
      {
        product: {
          _id: { type: String, require: true },
          name: { type: String },
          banner: { type: String },
          price: { type: Number },
        },
        unit:{ type: Number, require: true },
      },
    ],
    address: [
      {
        type: Schema.Types.ObjectId,
        ref: "address",
        require: true,
      },
    ],
    wishList: [
      {
        _id: { type: String, require: true },
        name: { type: String },
        desc: { type: String },
        banner: { type: String },
        available: { type: Boolean },
        price: { type: Number },
      },
    ],
    orders: [
      {
        _id: { type: String, require: true },
        amount: { type: String },
        date: { type: Date, default: Date.now() },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
      },
    },
    timestamps: true,
  }
);

export const CustomerModel = mongoose.model<ICustomer>(
  "customer",
  CustomerSchema
);
