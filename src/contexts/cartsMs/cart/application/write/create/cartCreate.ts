import EventBus from "../../../../../shared/domain/eventBus/eventBus";
import QueryBus from "../../../../../shared/domain/queryBus/queryBus";
import CartAlreadyExists from "../../../domain/cartAlreadyExists";
import CartId from "../../../domain/valueObject/cartId";
import UserId from "../../../domain/valueObject/userId";
import Cart from "../../../domain/write/cart";
import CartEventStore from "../../../domain/write/cartEventStore";
import CartCountByIdQuery from "../../read/countById/cartCountByIdQuery";
import CartCountByIdResponse from "../../read/countById/cartCountByIdResponse";

export default class CartCreate {
  constructor(
    private eventStore: CartEventStore,
    private eventBus: EventBus,
    private queryBus: QueryBus
  ) {}

  async run(id: string, userId: string): Promise<void> {
    const cartId = new CartId(id);
    await this.ensureNotInUse(cartId);

    const cart = Cart.create(cartId, new UserId(userId));

    const events = cart.pullDomainEvents();
    await this.eventStore.apply(events);
    await this.eventBus.publish(events);
  }

  private async ensureNotInUse(id: CartId) {
    const query = new CartCountByIdQuery(id.toString());
    const countResponse: CartCountByIdResponse = await this.queryBus.ask(query);
    if (countResponse.count.value > 0) {
      throw new CartAlreadyExists(id.toString());
    }
  }
}
