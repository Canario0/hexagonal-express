import { Request, Response } from "express";
import httpStatus from "http-status";
import CartItemFindAllQuery from "../../../../contexts/cartsMs/cart/application/read/findAllItemsByCart/cartItemFindAllQuery";
import CartItemFindAllResponse from "../../../../contexts/cartsMs/cart/application/read/findAllItemsByCart/cartItemFindAllResponse";
import CartNotFoundError from "../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartItemView from "../../../../contexts/cartsMs/cart/domain/read/cartItemView";
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

  private toResponse(items: CartItemView[]) {
    return items.map((cartItem) => ({
      productId: cartItem.productId,
      price: cartItem.price,
      count: cartItem.count,
      cartId: cartItem.cartId,
    }));
  }
}
