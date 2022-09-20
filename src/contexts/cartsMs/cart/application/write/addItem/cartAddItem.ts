import EventBus from "../../../../../shared/domain/eventBus/eventBus";
import QueryBus from "../../../../../shared/domain/queryBus/queryBus";
import CartExistsChecker from "../../../../shared/domain/existsChecker/cartExistsChecker";
import CartId from "../../../domain/valueObject/cartId";
import Price from "../../../domain/valueObject/price";
import ProductId from "../../../domain/valueObject/productId";
import CartEventStore from "../../../domain/write/cartEventStore";

export default class CartAddItem {
  constructor(
    private eventStore: CartEventStore,
    private eventBus: EventBus,
    private queryBus: QueryBus
  ) {}

  async run(cartId: string, productId: string, price: number): Promise<void> {
    const cartIdVa = new CartId(cartId);
    const cartItemId = new ProductId(productId);
    const itemPrice = new Price(price);
    await this.ensureCartExists(cartIdVa);

    let cart = await this.eventStore.load(cartIdVa);
    cart!.addItem(cartItemId, itemPrice);

    const events = cart!.pullDomainEvents();
    await this.eventStore.apply(events);
    await this.eventBus.publish(events);
  }

  private async ensureCartExists(id: CartId) {
    await new CartExistsChecker(this.queryBus).run(id);
  }
}
