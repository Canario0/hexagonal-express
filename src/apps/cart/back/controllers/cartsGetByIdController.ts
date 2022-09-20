import { Request, Response } from "express";
import httpStatus from "http-status";
import CartView from "../../../../contexts/cartsMs/cart/domain/read/cartView";
import CartNotFoundError from "../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import InvalidArgumentError from "../../../../contexts/shared/domain/invalidArgumentError";
import Logger from "../../../../contexts/shared/domain/logger";
import QueryBus from "../../../../contexts/shared/domain/queryBus/queryBus";
import Controller from "./controllers";
import CartFindByIdQuery from "../../../../contexts/cartsMs/cart/application/read/findById/cartFindByIdQuery";
import CartFindByIdResponse from "../../../../contexts/cartsMs/cart/application/read/findById/cartFindByIdResponse";

export default class CartsGetByIdController implements Controller {
  constructor(private queryBus: QueryBus, private logger: Logger) {}
  async run(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const query = new CartFindByIdQuery(id);
      const cartResponse: CartFindByIdResponse = await this.queryBus.ask(query);
      res.status(httpStatus.OK).send(this.toResponse(cartResponse.cart));
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

  private toResponse(cart: CartView) {
    return {
      id: cart.id.toJSON(),
      userId: cart.userId.toJSON(),
      validated: cart.validated.toJSON(),
      items: cart.items.toJSON(),
    };
  }
}
