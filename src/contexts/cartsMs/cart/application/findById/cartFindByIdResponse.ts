import Response from "../../../../shared/domain/queryBus/response";
import CartView from "../../domain/read/cartView";

export default class CartFindByIdResponse implements Response {
  public readonly cart: CartView;

  constructor(cart: CartView) {
    this.cart = cart;
  }
}
