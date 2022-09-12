import Cart from "./cart";
import CartId from "./valueObject/cartId";

export default interface CartRepository {
  findById(id: CartId): Promise<Cart | null>;
}
