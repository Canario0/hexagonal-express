import CartId from "../../cart/domain/valueObject/cartId";
import CartItem from "./cartItem";
import CartItemId from "./valueObject/cartItemId";

export default interface CartItemRepository {
  findAll(id: CartId): Promise<CartItem[]>;
  findById(id: CartItemId): Promise<CartItem | null>;
  save(cartItem: CartItem): Promise<void>;
}
