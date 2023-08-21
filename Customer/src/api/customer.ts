import CustomerService from "../services/customer-service";
import express, { Response, Request, NextFunction } from "express";
import userAuth from "./middleware/auth";

export const Customer = (app: express.Application) => {
  const service = new CustomerService();

  //SIGNUP
  app.post(
    "/signup",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password, phone } = req.body;
        const data = await service.SignUp({ email, password, phone });
        return res.status(201).json(data);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ Error: "Internal Server Error" });
      }
    }
  );

  //SIGNIN
  app.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const data = await service.Login({ email, password });

      return res.status(200).json({ message: "Login successful", data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  //CREATE ADDRESS
  app.post("/address", userAuth, async (req: Request | any, res: Response) => {
    try {
      const { _id } = req.user;
      const { street, city, country } = req.body;
      const address = await service.AddAdress(_id, { street, city, country });
      if (address)
        return res
          .status(201)
          .json({ message: "Address Added successful", address });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  //GET PROFILE
  app.get("/profile", userAuth, async (req: Request | any, res: Response) => {
    try {
      const { _id } = req.user;
      const user = await service.GetProfile(_id);
      if (user) return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  //GET SHOPPING DETAILS
  app.get(
    "/shopping-details",
    userAuth,
    async (req: Request | any, res: Response) => {
      try {
        const { _id } = req.user;
        const shoppingDetails = await service.GetShoppingDetails(_id);
        if (shoppingDetails) return res.status(200).json(shoppingDetails);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ Error: "Internal Server Error" });
      }
    }
  );

  //GET WISHLIST
  app.get("/wishlist", userAuth, async (req: Request | any, res: Response) => {
    try {
      const { _id } = req.user;
      const wishList = await service.GetWishList(_id);
      if (wishList) return res.status(200).json(wishList);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  //GET CART
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

  app.delete("/delete/:id", async (req: Request | any, res: Response) => {
    try {
      const {id} = req.params
      const deleted = await service.DeleteCustomer(id)
      if (deleted) return res.status(200).json({message:"Deleted successfully",deleted});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  })
};
