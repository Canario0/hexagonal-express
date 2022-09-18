import Response from "../../../../shared/domain/queryBus/response";
import CartItem from "../../domain/cartItem";

export default class CartItemFindAllResponse implements Response {
  public readonly cartItems: CartItem[];

  constructor(cartItems: CartItem[]) {
    this.cartItems = cartItems;
  }
}
