import { Request, Response } from "express";
import httpStatus from "http-status";
import CartCreateCommand from "../../../../contexts/cartsMs/cart/application/create/cartCreateCommand";
import CartAlreadyExists from "../../../../contexts/cartsMs/cart/domain/cartAlreadyExists";
import CommandBus from "../../../../contexts/shared/domain/commandBus/commandBus";
import InvalidArgumentError from "../../../../contexts/shared/domain/invalidArgumentError";
import Logger from "../../../../contexts/shared/domain/logger";
import Uuid from "../../../../contexts/shared/domain/valueObject/uuid";
import Controller from "./controllers";

export default class CartsPostController implements Controller {
  constructor(private commandBus: CommandBus, private logger: Logger) {}

  async run(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const cartId = Uuid.random().toString();

      const command = new CartCreateCommand(cartId, userId);
      await this.commandBus.dispatch(command);

      res.status(httpStatus.CREATED).send({ id: cartId });
    } catch (err) {
      if (err instanceof InvalidArgumentError) {
        res.status(httpStatus.BAD_REQUEST).send({ message: err.message });
      } else if (err instanceof CartAlreadyExists) {
        res.status(httpStatus.CONFLICT).send({ message: err.message });
      } else {
        this.logger.error(`[${this.constructor.name}] ${err}`);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
      }
    }
  }
}
