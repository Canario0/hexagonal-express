import EventBus from "../../../../shared/domain/eventBus/eventBus";
import CartId from "../../../cart/domain/valueObject/cartId";
import CartExistsChecker from "../../../shared/domain/existsChecker/cartExistsChecker";
import CartItemView from "../../../cart/domain/read/cartItemView";
import CartItemViewRepository from "../../../cart/domain/read/cartItemViewRepository";
import CartViewRepository from "../../../cart/domain/read/cartViewRepository";
import ProductId from "../../domain/valueObject/productId";
import Price from "../../../cart/domain/valueObject/price";

export default class CartItemCreate {
  constructor(
    private cartItemRepository: CartItemViewRepository,
    private cartRepository: CartViewRepository,
    private eventBus: EventBus
  ) {}

  async run(cartId: string, id: string, price: number): Promise<void> {
    const cartIdVa = new CartId(cartId);
    const cartItemId = new ProductId(id);
    const itemPrice = new Price(price);
    await this.ensureCartExists(cartIdVa);
    let item = await this.cartItemRepository.findById(cartItemId);
    if (item === null) {
      item = CartItemView.create(cartItemId, itemPrice, cartIdVa);
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
