import Cart from "../../domain/cart";
import CartAlreadyExists from "../../domain/cartAlreadyExists";
import CartRepository from "../../domain/cartRepository";
import CartId from "../../domain/valueObject/cartId";
import UserId from "../../domain/valueObject/userId";

export default class CartCreate {
  constructor(private cartRepository: CartRepository) {}

  async run(id: string, userId: string): Promise<void> {
    const cartId = new CartId(id);
    await this.ensureNotInUse(cartId);
    await this.cartRepository.save(Cart.create(cartId, new UserId(userId)));
  }

  private async ensureNotInUse(id: CartId) {
    const count = await this.cartRepository.countById(id);
    if (count.value > 0) {
      throw new CartAlreadyExists(id.toString());
    }
  }
}
