import mongoose, { Schema } from "mongoose";

export interface ICart {
  customerId: string;

  items: Array<object>;
}
const CartSchema = new Schema(
  {
  
    customerId: String,
    items: [
        {
            product: {
              _id: { type: String, require: true },
              name: { type: String },
              desc: { type: String },
              type: { type: String },
              unit: { type: String },
              banner: { type: String },
              supplier: { type: String },
              price: { type: Number },
            },
            unit: { type: Number, require: true },
          },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._v;
      },
    },
    timestamps: true,
  }
);

export const CartModel = mongoose.model<ICart>(
  "cart",
  CartSchema
);
