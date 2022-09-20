import { DomainEventClass } from "../../../../../shared/domain/eventBus/domainEvent";
import DomainEventSubscriber from "../../../../../shared/domain/eventBus/domainEventSubscriber";
import CartCreatedDomainEvent from "../../../domain/write/cartCreatedDomainEvent";
import CartViewCreate from "./cartViewCreate";

export default class CartViewCreateOnCartViewCreated
  implements DomainEventSubscriber<CartCreatedDomainEvent>
{
  constructor(private cartViewCreate: CartViewCreate) {}

  subscriberName(): string {
    return "celtiFake.cartView.CartViewCreateOnCartViewCreated";
  }

  subscribedTo(): DomainEventClass[] {
    return [CartCreatedDomainEvent];
  }

  async on(event: CartCreatedDomainEvent) {
    await this.cartViewCreate.run({
      id: event.aggregateId,
      userId: event.userId,
      validated: event.validated,
    });
  }
}
