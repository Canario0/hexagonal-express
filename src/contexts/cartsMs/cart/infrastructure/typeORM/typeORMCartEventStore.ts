import DomainEvent from "../../../../shared/domain/eventBus/domainEvent";
import TypeORMDomainEvent from "../../../shared/infrastructure/typeORM/entities/typeOrmEvent";
import TypeORMEventStore from "../../../shared/infrastructure/typeORM/typeORMEventStore";
import CartId from "../../domain/valueObject/cartId";
import Cart from "../../domain/write/cart";
import CartEventStore from "../../domain/write/cartEventStore";

export default class TypeORMCartEventStore
  extends TypeORMEventStore
  implements CartEventStore
{
  protected hydrateEvent(rawEvent: TypeORMDomainEvent): DomainEvent {
    const eventClass = Cart.eventFor(rawEvent.name);
    return eventClass!.fromPrimitives(
      rawEvent.aggregateId,
      rawEvent.body,
      rawEvent.id,
      rawEvent.occurredOn
    );
  }
  public async load(id: CartId): Promise<Cart | null> {
    const eventRepository = await this.getRepository();
    const rawEvents = await eventRepository.find({
      where: {
        aggregateId: id.value,
      },
      order: {
        aggregateVersion: "ASC",
      },
    });
    if (rawEvents.length === 0) {
      return null;
    }
    const events = rawEvents.map(this.hydrateEvent);
    const cart = Cart.loadEvents(events);
    return cart;
  }
}
