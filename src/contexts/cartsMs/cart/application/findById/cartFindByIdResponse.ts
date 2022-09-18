import Response from "../../../../shared/domain/queryBus/response";
import Cart from "../../domain/cart";

export default class CartFindByIdResponse implements Response {
  public readonly cart: Cart;

  constructor(cart: Cart) {
    this.cart = cart;
  }
}
