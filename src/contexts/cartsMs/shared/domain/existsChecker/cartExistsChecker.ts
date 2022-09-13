import CartNotFoundError from "../../../cart/domain/cartNotFoundError";
import CartRepository from "../../../cart/domain/cartRepository";
import CartId from "../../../cart/domain/valueObject/cartId";

export default class CartExistsChecker {
  constructor(private cartRepository: CartRepository) {}

  public async run(id: CartId) {
    const cartCount = await this.cartRepository.countById(id);
    if (cartCount.value === 0) {
      throw new CartNotFoundError(id.toString());
    }
  }
}
