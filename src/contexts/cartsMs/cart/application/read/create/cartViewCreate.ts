import CartView from "../../../domain/read/cartView";
import CartViewRepository from "../../../domain/read/cartViewRepository";
import CartId from "../../../domain/valueObject/cartId";
import CartValidated from "../../../domain/valueObject/cartValidated";
import UserId from "../../../domain/valueObject/userId";

export default class CartViewCreate {
  constructor(private cartViewRepository: CartViewRepository) {}

  async run(cartPrimitive: { id: string; userId: string; validated: boolean }) {
    const cartId = new CartId(cartPrimitive.id);
    const cartCount = await this.cartViewRepository.countById(cartId);
    if (cartCount.value > 0) {
      return;
    }
    const cart = CartView.create(
      cartId,
      new UserId(cartPrimitive.userId),
      new CartValidated(cartPrimitive.validated)
    );
    await this.cartViewRepository.save(cart);
  }
}
