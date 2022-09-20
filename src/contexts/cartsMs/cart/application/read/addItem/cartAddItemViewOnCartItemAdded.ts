import { DomainEventClass } from "../../../../../shared/domain/eventBus/domainEvent";
import DomainEventSubscriber from "../../../../../shared/domain/eventBus/domainEventSubscriber";
import CartItemAddedDomainEvent from "../../../domain/write/cartItemAddedDomainEvent";
import CartAddItemView from "./cartAddItemView";

export default class CartAddItemViewOnCartItemAdded
  implements DomainEventSubscriber<CartItemAddedDomainEvent>
{
  constructor(private cartAddItemView: CartAddItemView) {}

  subscriberName(): string {
    return "celtiFake.cartItemView.CartAddItemViewOnCartItemAdded";
  }

  subscribedTo(): DomainEventClass[] {
    return [CartItemAddedDomainEvent];
  }

  async on(event: CartItemAddedDomainEvent) {
    await this.cartAddItemView.run({
      cartId: event.aggregateId,
      productId: event.productId,
      price: event.price,
    });
  }
}
