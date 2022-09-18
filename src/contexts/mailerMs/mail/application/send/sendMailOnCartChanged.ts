import CartCreatedDomainEvent from "../../../../cartsMs/cart/domain/cartCreatedDomainEvent";
import CartItemAddedDomainEvent from "../../../../cartsMs/cart/domain/cartItemAddedDomainEvent";
import { DomainEventClass } from "../../../../shared/domain/eventBus/domainEvent";
import DomainEventSubscriber from "../../../../shared/domain/eventBus/domainEventSubscriber";
import Logger from "../../../../shared/domain/logger";

export default class SendMailOnCartChanged
  implements
    DomainEventSubscriber<CartCreatedDomainEvent | CartItemAddedDomainEvent>
{
  constructor(private logger: Logger) {}

  subscriberName(): string {
    return "mailerMS.mail.SendMailOnCartChanged";
  }

  subscribedTo(): DomainEventClass[] {
    return [CartCreatedDomainEvent, CartItemAddedDomainEvent];
  }

  async on(
    domainEvent: CartCreatedDomainEvent | CartItemAddedDomainEvent
  ): Promise<void> {
    // TODO: implement mail system
    this.logger.debug(`[${this.constructor.name}]: ${domainEvent}`);
  }
}
