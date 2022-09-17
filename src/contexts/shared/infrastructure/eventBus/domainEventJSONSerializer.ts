import DomainEvent from "../../domain/eventBus/domainEvent";

export default class DomainEventJSONSerializer {
  public serialize(domainEvent: DomainEvent): Object {
    // CAVEAT: to have a deeper understanding on
    // this structure check https://jsonapi.org/
    return {
      data: {
        id: domainEvent.eventId,
        type: domainEvent.eventName,
        occurred_on: domainEvent.occurredOn,
        attributes: {
          ...domainEvent.toPrimitive(),
          id: domainEvent.aggregateId,
        },
      },
      meta: {},
    };
  }
}
