import { IOrder, Iproduct } from "../../services/customer-services.dto";
import { AddressModel, CustomerModel, IAddress, ICustomer } from "../models";

export class CustomerRepository {
  //ADD CUSTOMER
  async CreateCustomer(CustomerData: ICustomer) {
    try {
      const customer = new CustomerModel(CustomerData);
      const customerResult = await customer.save();

      return customerResult;
    } catch (error) {
      console.log(error);
    }
  }

  //FIND CUSTOMER BY EMAIL
  async FindCustomer({ email }: { email: string }) {
    const existingUser = await CustomerModel.findOne({ email });
    return existingUser;
  }

  //FIND CUSTOMER BY ID

  async FindCustomerById(id: string) {
    try {
      const existingCustomer = await CustomerModel.findById(id).populate(
        "address"
      );
      return existingCustomer;
    } catch (error) {
      console.log(error);
    }
  }

  //CART
  async GetCartItems(customerId: string) {
    try {
      const profile = (await CustomerModel.findById(customerId).populate(
        "cart"
      )) as ICustomer;
      return profile.cart;
    } catch (error) {
      console.log(error);
    }
  }

  //WISHLIST
  async WishList(customerId: string) {
    try {
      const profile = (await CustomerModel.findById(customerId).populate(
        "wishList"
      )) as ICustomer;
      return profile.wishList;
    } catch (error) {
      console.log(error);
    }
  }

  //AddWishList
  async AddWishListItem(
    customerId: string,
    product: Iproduct,
    isRemove: boolean
  ) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        "wishList"
      );

      if (profile) {
        const wishList = profile.wishList;
        const existingIndex = wishList.findIndex(
          (item: any) => item._id.toString() === product._id.toString()
        );

        if (isRemove) {
          if (existingIndex !== -1) {
            wishList.splice(existingIndex, 1);
          }
        } else {
          if (existingIndex === -1) {
            wishList.push(product);
          }
        }

        const profileResult = await profile.save();
        return profileResult.wishList;
      }
    } catch (error) {
      console.log(error);
    }
  }

  //AddCartItem

  async AddCartItem(
    customerId: string,
    product: Iproduct,
    qty: number,
    isRemove: boolean
  ) {
    try {
      const profile = await CustomerModel.findById(customerId).populate("cart");
    
      if (profile) {
        const cartItem = { product, unit: qty };
        const cartItems = profile.cart;

        const existingIndex = cartItems.findIndex(
          (item: any) => item.product._id.toString() === cartItem.product._id.toString()
        );

        if (isRemove) {
          if (existingIndex !== -1) {
            cartItems.splice(existingIndex, 1);
          }
        } else {
          if (existingIndex === -1) {
            cartItems.push(cartItem);
          } else {
            cartItems[existingIndex].unit = qty;
          }
        }


        const cartSaveResult = await profile.save();

        return cartSaveResult.cart;
      }
      throw new Error("Unable to save to cart");
    } catch (error) {
      console.log(error);
    }
  }

  //ADD ORDER
  async AddOrderToProfile(customerId: string, order: IOrder) {
    try {
      const profile = await CustomerModel.findById(customerId);
      if (profile) {
        if (profile.orders === undefined) {
          profile.orders = [];
        }
        profile.orders.push(order);
        profile.cart = [];
        const profileResult = await profile.save();
        return profileResult;
      }
      throw new Error("Unable to add to order!");
    } catch (error) {
      console.log(error);
    }
  }

  //CREATE ADDRESS

  async CreateAddress(customerId: string, address: IAddress) {
    try {
      const profile = await CustomerModel.findById(customerId);
      if (profile) {
        const profileAddress = profile?.address;

        if (profileAddress.length === 0) {
          const newAddress = new AddressModel(address);
          await newAddress.save();
          profileAddress.push(newAddress);

          await profile.save();
          return newAddress;
        } else {
          const adresssToUpdate = await AddressModel.findByIdAndUpdate(
            profileAddress[0]
          );
          const adresss = await adresssToUpdate?.updateOne(address);
          return adresss;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async DeleteUser(customerId: string) {
    const profile = await CustomerModel.findById(customerId);
    if (profile) {
      return profile.deleteOne();
    }
  }
}
