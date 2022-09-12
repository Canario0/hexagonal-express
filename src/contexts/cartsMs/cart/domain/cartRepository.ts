import Cart from "./cart";
import CartCount from "./valueObject/cartCount";
import CartId from "./valueObject/cartId";

export default interface CartRepository {
  findById(id: CartId): Promise<Cart | null>;
  countById(id: CartId): Promise<CartCount>;
  save(cart: Cart): Promise<void>
}
