import EventBus from "../../../../shared/domain/eventBus/eventBus";
import CartRepository from "../../../cart/domain/cartRepository";
import CartId from "../../../cart/domain/valueObject/cartId";
import CartExistsChecker from "../../../shared/domain/existsChecker/cartExistsChecker";
import CartItem from "../../domain/cartItem";
import CartItemRepository from "../../domain/cartItemRepository";
import CartItemId from "../../domain/valueObject/cartItemId";
import { Price } from "../../domain/valueObject/price";

export default class CartItemCreate {
  constructor(
    private cartItemRepository: CartItemRepository,
    private cartRepository: CartRepository,
    private eventBus: EventBus
  ) {}

  async run(cartId: string, id: string, price: number): Promise<void> {
    const cartIdVa = new CartId(cartId);
    const cartItemId = new CartItemId(id);
    const itemPrice = new Price(price);
    await this.ensureCartExists(cartIdVa);
    let item = await this.cartItemRepository.findById(cartItemId);
    if (item === null) {
      item = CartItem.create(cartItemId, itemPrice, cartIdVa);
    } else {
      item.incrementCount();
    }
    await this.cartItemRepository.save(item);
    await this.eventBus.publish(item.pullDomainEvents());
  }

  private async ensureCartExists(id: CartId) {
    await new CartExistsChecker(this.cartRepository).run(id);
  }
}
