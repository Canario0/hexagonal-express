import { Request, Response } from "express";
import httpStatus from "http-status";
import CartNotFoundError from "../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartItemCreate from "../../../../contexts/cartsMs/cartItem/application/create/cartItemCreate";
import InvalidArgumentError from "../../../../contexts/shared/domain/invalidArgumentError";
import Controller from "./controllers";

export default class CartItemsPostController implements Controller {
  constructor(private cartItemCreate: CartItemCreate) {}

  async run(req: Request, res: Response) {
    try {
      const { cartId } = req.params;
      const { id, price } = req.body;
      await this.cartItemCreate.run(cartId, id, price);
      res.status(httpStatus.CREATED).send();
    } catch (err) {
      if (err instanceof InvalidArgumentError) {
        res.status(httpStatus.BAD_REQUEST).send({ message: err.message });
      } else if (err instanceof CartNotFoundError) {
        res.status(httpStatus.NOT_FOUND).send({ message: err.message });
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
      }
    }
  }
}
