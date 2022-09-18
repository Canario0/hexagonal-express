import { Request, Response } from "express";
import httpStatus from "http-status";
import CartNotFoundError from "../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartItemFindAllQuery from "../../../../contexts/cartsMs/cartItem/application/findAll/cartItemFindAllQuery";
import CartItemFindAllResponse from "../../../../contexts/cartsMs/cartItem/application/findAll/cartItemFindAllResponse";
import CartItem from "../../../../contexts/cartsMs/cartItem/domain/cartItem";
import InvalidArgumentError from "../../../../contexts/shared/domain/invalidArgumentError";
import Logger from "../../../../contexts/shared/domain/logger";
import QueryBus from "../../../../contexts/shared/domain/queryBus/queryBus";
import Controller from "./controllers";

export default class CartItemsGetAllController implements Controller {
  constructor(private queryBus: QueryBus, private logger: Logger) {}

  async run(req: Request, res: Response) {
    try {
      const { cartId } = req.params;
      const query = new CartItemFindAllQuery(cartId);
      const itemsResponse: CartItemFindAllResponse = await this.queryBus.ask(
        query
      );
      res.status(httpStatus.OK).send(this.toResponse(itemsResponse.cartItems));
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

  private toResponse(items: CartItem[]) {
    return items.map((cartItem) => ({
      id: cartItem.id,
      price: cartItem.price,
      count: cartItem.count,
      cartId: cartItem.cartId,
    }));
  }
}
