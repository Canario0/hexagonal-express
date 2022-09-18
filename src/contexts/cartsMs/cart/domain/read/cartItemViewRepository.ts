import CartId from "../valueObject/cartId";
import ProductId from "../valueObject/productId";
import CartItemView from "./cartItemView";

export default interface CartItemViewRepository {
  findAll(id: CartId): Promise<CartItemView[]>;
  findById(id: ProductId): Promise<CartItemView | null>;
  save(cartItem: CartItemView): Promise<void>;
}
