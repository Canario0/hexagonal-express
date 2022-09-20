import CartId from "../valueObject/cartId";
import ProductId from "../valueObject/productId";
import CartItemView from "./cartItemView";

export default interface CartItemViewRepository {
  findAll(productId: CartId): Promise<CartItemView[]>;
  findById(productId: ProductId): Promise<CartItemView | null>;
  findByProductAndCart(
    productId: ProductId,
    cartId: CartId
  ): Promise<CartItemView | null>;
  save(cartItem: CartItemView): Promise<void>;
}
