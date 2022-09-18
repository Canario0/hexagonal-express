import { Request, Response } from "express";
import httpStatus from "http-status";
import CartNotFoundError from "../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartItemCreateCommand from "../../../../contexts/cartsMs/cartItem/application/create/cartItemCreateCommand";
import CommandBus from "../../../../contexts/shared/domain/commandBus/commandBus";
import InvalidArgumentError from "../../../../contexts/shared/domain/invalidArgumentError";
import Logger from "../../../../contexts/shared/domain/logger";
import Controller from "./controllers";

export default class CartItemsPostController implements Controller {
  constructor(private commandBus: CommandBus, private logger: Logger) {}

  async run(req: Request, res: Response) {
    try {
      const { cartId } = req.params;
      const { id, price } = req.body;
      const command = new CartItemCreateCommand(cartId, id, price);
      await this.commandBus.dispatch(command);
      res.status(httpStatus.CREATED).send();
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
}
