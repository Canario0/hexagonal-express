import CartCount from "../valueObject/cartCount";
import CartId from "../valueObject/cartId";
import CartView from "./cartView";

export default interface CartViewRepository {
  findById(id: CartId): Promise<CartView | null>;
  countById(id: CartId): Promise<CartCount>;
  save(cart: CartView): Promise<void>
}
