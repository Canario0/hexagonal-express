import { Request, Response } from "express";
import httpStatus from "http-status";
import CartFindById from "../../../../contexts/cartsMs/cart/application/findById/cartFindById";
import Cart from "../../../../contexts/cartsMs/cart/domain/cart";
import CartNotFoundError from "../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import InvalidArgumentError from "../../../../contexts/shared/domain/invalidArgumentError";
import Logger from "../../../../contexts/shared/domain/logger";
import Controller from "./controllers";

export default class CartsGetByIdController implements Controller {
  constructor(private cartFindById: CartFindById, private logger: Logger) {}
  async run(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cart = await this.cartFindById.run(id);
      res.status(httpStatus.OK).send(this.toResponse(cart));
    } catch (err) {
      if (err instanceof InvalidArgumentError) {
        res.status(httpStatus.BAD_REQUEST).send({ message: err.message });
      } else if (err instanceof CartNotFoundError) {
        res.status(httpStatus.NOT_FOUND).send({ message: err.message });
      } else {
        this.logger.error(`[${this.constructor.name}] ${err}`);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
      }
    }
  }

  private toResponse(cart: Cart) {
    return {
      id: cart.id.toJSON(),
      userId: cart.userId.toJSON(),
      validated: cart.validated.toJSON(),
      items: cart.items.toJSON(),
    };
  }
}
