import { Request, Response } from "express";
import httpStatus from "http-status";
import CartCreate from "../../../../contexts/cartsMs/cart/application/create/cartCreate";
import CartAlreadyExists from "../../../../contexts/cartsMs/cart/domain/cartAlreadyExists";
import InvalidArgumentError from "../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../contexts/shared/domain/valueObject/uuid";
import Controller from "./controllers";

export default class CartsPostController implements Controller {
  constructor(private cartCreate: CartCreate) {}
  async run(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const cartId = Uuid.random().toString();
      await this.cartCreate.run(cartId, userId);
      res.status(httpStatus.CREATED).send({ id: cartId });
    } catch (err) {
      if (err instanceof InvalidArgumentError) {
        res.status(httpStatus.BAD_REQUEST).send({ message: err.message });
      } else if (err instanceof CartAlreadyExists) {
        res.status(httpStatus.CONFLICT).send({ message: err.message });
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
      }
    }
  }
}
