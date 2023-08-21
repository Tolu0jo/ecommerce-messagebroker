import { CartModel, ICart, OrderModel } from "../models";
import { v4 as uuidv4 } from "uuid";
export class ShoppingRepository {
  // get Orders

  async getOrders(customerId: string) {
    try {
      const orders = await OrderModel.find({ customerId });
      return orders;
    } catch (error) {
      console.log(error);
    }
  }

  //GET CART
  async getCart(customerId: string) {
    try {
      const cart = await CartModel.find({ customerId });
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  //ADD CART ITEM
  async AddCartItem(
    customerId: string,
    item: any,
    qty: number,
    isRemove: boolean
  ) {
    try {
 
      const cart = await CartModel.findOne({ customerId });
      const { _id } = item;
      if (cart) {
        let isExist = false;
        let cartItems = cart.items;
      
        if (cartItems.length > 0) {
          cartItems.map((item: any) => {
            if (item.product._id.toString() === _id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });
        }
        if (!isExist && !isRemove) {
          cartItems.push({ product: { ...item }, unit: qty });
        }
        cart.items = cartItems;
        return await cart.save();
      } else {
        return await CartModel.create({
          customerId,
          items: { product: { ...item }, unit: qty },
        });
        
      }
    } catch (error) {
      console.log(error);
    }
  }

  //CREATE NEW ORDER
  async CreateNewOrder(customerId: string, transactionId: string) {
    try {
      const cart = await CartModel.findOne({ customerId });

      if (cart) {
        let amount = 0;
        let cartItems = cart.items;

        if (cartItems.length > 0) {
          cartItems.map((item: any) => {
            amount += item.product.price * item.unit;
          });
          const orderId = uuidv4();

          const order = new OrderModel({
            orderId,
            customerId,
            amount,
            transactionId,
            status: "recieved",
            items: cartItems,
          });

          cart.items = [];
          
           await cart.save()
          const orderResult = await order.save();
          return orderResult;
        }
      }
      return {};
    } catch (error) {
      console.log(error);
    }
  }
}
