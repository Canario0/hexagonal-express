import DomainEvent from "../../../shared/domain/eventBus/domainEvent";

export default class EventSourceNotRegistered extends Error {
  constructor(event: DomainEvent) {
    super(
      `The event <${event.eventName}> hasn't a event sourcing subscriber associated`
    );
  }
}
