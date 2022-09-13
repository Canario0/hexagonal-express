import { Request, Response } from "express";
import httpStatus from "http-status";
import CartNotFoundError from "../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartItemFindAll from "../../../../contexts/cartsMs/cartItem/application/findAll/cartItemFindAll";
import CartItem from "../../../../contexts/cartsMs/cartItem/domain/cartItem";
import InvalidArgumentError from "../../../../contexts/shared/domain/invalidArgumentError";
import Controller from "./controllers";

export default class CartItemsGetAllController implements Controller {
  constructor(private cartItemFindAll: CartItemFindAll) {}

  async run(req: Request, res: Response) {
    try {
      const { cartId } = req.params;
      const items = await this.cartItemFindAll.run(cartId);
      res.status(httpStatus.OK).send(this.toResponse(items));
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

  private toResponse(items: CartItem[]) {
    return items.map((cartItem) => ({
      id: cartItem.id,
      price: cartItem.price,
      count: cartItem.count,
      cartId: cartItem.cartId,
    }));
  }
}
