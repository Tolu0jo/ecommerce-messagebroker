import { ShoppingRepository } from "../database/repository/shopping-repository";
import { formatData } from "../utils";
import { IPlaceOrder } from "./shopping-service.dto";

class ShoppingService {
  repository;
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async GetCart(_id: string) {
    try {
      const cart = await this.repository.getCart(_id);
      return formatData(cart);
    } catch (error) {
      console.log(error);
    }
  }

  async PlaceOrder(Input: IPlaceOrder) {
    try {
      const { _id, transactionId } = Input;
      const order = await this.repository.CreateNewOrder(_id, transactionId);
      return formatData(order);
    } catch (error) {
      console.log(error);
    }
  }

  async GetOrder(customerId: string) {
    try {
      const orders = await this.repository.getOrders(customerId);
      return formatData(orders);
    } catch (error) {
      console.log(error);
    }
  }

  async ManageCart(
    customerId: string,
    item: any,
    qty: number,
    isRemove: boolean
  ) {
    try {
      const cart = await this.repository.AddCartItem(
        customerId,
        item,
        qty,
        isRemove
      );
      return formatData(cart);
    } catch (error) {
      console.log(error);
    }
  }

  async SubscriberEvents(payload: any) {
    payload = JSON.parse(payload);

    const { event, data } = payload;

    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
       await this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
     await this.ManageCart(userId, product, qty, true);
        break;
      default:
        break;
    }
  };


  async GetOrderPayload(
    userId: string,
    order:any,
    event: string
  ) {
    try {
      if (order) {
        const payload = {
          event,
          data: { userId, order },
        };
        return formatData(payload);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

export default ShoppingService;
