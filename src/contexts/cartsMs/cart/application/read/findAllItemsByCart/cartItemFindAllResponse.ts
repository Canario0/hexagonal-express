import Response from "../../../../../shared/domain/queryBus/response";
import CartItemView from "../../../domain/read/cartItemView";

export default class CartItemFindAllResponse implements Response {
  public readonly cartItems: CartItemView[];

  constructor(cartItems: CartItemView[]) {
    this.cartItems = cartItems;
  }
}
