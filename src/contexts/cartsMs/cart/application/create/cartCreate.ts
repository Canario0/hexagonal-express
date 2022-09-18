import EventBus from "../../../../shared/domain/eventBus/eventBus";
import CartView from "../../domain/read/cartView";
import CartAlreadyExists from "../../domain/cartAlreadyExists";
import CartRepository from "../../domain/cartRepository";
import CartId from "../../domain/valueObject/cartId";
import UserId from "../../domain/valueObject/userId";

export default class CartCreate {
  constructor(
    private cartRepository: CartRepository,
    private eventBus: EventBus
  ) {}

  async run(id: string, userId: string): Promise<void> {
    const cartId = new CartId(id);
    await this.ensureNotInUse(cartId);

    const cart = CartView.create(cartId, new UserId(userId));

    await this.cartRepository.save(cart);
    await this.eventBus.publish(cart.pullDomainEvents());
  }

  private async ensureNotInUse(id: CartId) {
    const count = await this.cartRepository.countById(id);
    if (count.value > 0) {
      throw new CartAlreadyExists(id.toString());
    }
  }
}
