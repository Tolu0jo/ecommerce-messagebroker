import { CustomerRepository } from "../database";
import { IOrder, Iproduct, Iuser, IuserLogin } from "./customer-services.dto";
import {
  GenerateSalt,
  GeneratePassword,
  GenerateSignature,
  formatData,
  validatePassword,
} from "../utils";
import { IAddress } from "../database/models";
class CustomerService {
  repository;
  constructor() {
    this.repository = new CustomerRepository();
  }
  async SignUp(userInput: Iuser) {
    try {
      const { email, password, phone } = userInput;
      const existingUser = await this.repository.FindCustomer({ email });
      if (existingUser) {
        throw new Error("Customer already exists");
      }

      const salt = await GenerateSalt();
      const userPassword = await GeneratePassword(password, salt);
      const customer = await this.repository.CreateCustomer({
        email,
        password: userPassword,
        phone,
        salt,
        cart: [],
        address: [],
        wishList: [],
        orders: [],
      });
      if (customer) {
        const token = GenerateSignature({ email, _id: customer._id });
        return formatData({ customer, token });
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async Login(userInput: IuserLogin) {
    try {
      const { email, password } = userInput;
      const user = await this.repository.FindCustomer({ email });
      if (!user) {
        throw new Error("Customer does not exists");
      }
      const validPassword = await validatePassword(
        password,
        user.password,
        user.salt
      );
      if (!validPassword) throw new Error("Invalid password");
      const token = GenerateSignature({ email, _id: user._id });
      return formatData({ id: user._id, token });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //CREATE-ADDRESS
  async AddAdress(id: string, address: IAddress) {
    try {
      const newAddress = await this.repository.CreateAddress(id, address);
      return formatData(newAddress);
    } catch (error) {
      console.log(error);
    }
  }

  //GET PROFILE

  async GetProfile(id: string) {
    try {
      const existingCustomer = await this.repository.FindCustomerById(id);
      if (existingCustomer) {
        return formatData(existingCustomer);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //GetCart
  async GetCart(id: string) {
    try {
      const cart = await this.repository.GetCartItems(id);
      if (cart) {
        return formatData(cart);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //GET SHOPPING DETAILS
  async GetShoppingDetails(id: string) {
    try {
      const existingCustomer = await this.repository.FindCustomerById(id);
      if (existingCustomer) {
        return formatData(existingCustomer);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //GET WISHLIST
  async GetWishList(customerId: string) {
    try {
      const wishLists = await this.repository.WishList(customerId);
      if (wishLists) {
        return formatData(wishLists);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //ADD WISHLIST

  async AddToWishList(customerId: string, product: Iproduct,event: string,isRemove: boolean) {
    try {
    
      const wishLists = await this.repository.AddWishListItem(
        customerId,
        product,isRemove
      );
      return formatData(wishLists);
    } catch (error) {
      console.log(error);
    }
  }
       
  async ManageOrder(customerId: string, order: IOrder) {
    try {
      const orderResult = await this.repository.AddOrderToProfile(
        customerId,
        order
      );
      return formatData(orderResult);
    } catch (error) {
      console.log(error);
    }
  }

  async ManageCart(
    customerId: string,
    product: any,
    qty: number,
    isRemove: boolean
  ) {
    const cartResult = await this.repository.AddCartItem(
      customerId,
      product,
      qty,
      isRemove
    );
    return cartResult;
  }

  async SubscriberEvents  (payload: any) {
    payload = JSON.parse(payload);

    const { event, data } = payload;

    const { userId, product, order, qty } = data;

    switch (event) {
       case "ADD_TO_WISHLIST":
        await this.AddToWishList(userId, product,event,false);
        break;
       case "REMOVE_FROM_WISHLIST":
       await this.AddToWishList(userId, product,event,true);
        break;
      case "ADD_TO_CART":
       await this.ManageCart(userId, product, qty, false);
       break;
      case "REMOVE_FROM_CART":
       await this.ManageCart(userId, product, qty, true);
        break;
      case "CREATE_ORDER":
       await this.ManageOrder(userId, order);
        break;
      default:
        break;
    }
  }

  async DeleteCustomer(customerId: string) {
    try {
      const deletedCustomer = await this.repository.DeleteUser(customerId);
      if (deletedCustomer) {
        return formatData(deletedCustomer);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default CustomerService;
