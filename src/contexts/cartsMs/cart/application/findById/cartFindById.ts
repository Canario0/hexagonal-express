import Cart from "../../domain/cart";
import CartNotFoundError from "../../domain/cartNotFoundError";
import CartRepository from "../../domain/cartRepository";
import CartId from "../../domain/valueObject/cartId";

export default class CartFindById {
  constructor(private cartRepository: CartRepository) {}

  async run(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findById(new CartId(id));
    if (cart === null) {
      throw new CartNotFoundError(id);
    }
    return cart;
  }
}
