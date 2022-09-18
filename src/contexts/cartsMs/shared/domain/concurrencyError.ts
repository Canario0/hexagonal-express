import DomainEvent from "../../../shared/domain/eventBus/domainEvent";

export default class ConcurrencyError extends Error {
  constructor(resourceName: string, event: DomainEvent) {
    super(
      `Concurrency error inserting event <${event.eventName}> with id <${event.eventId}> and version <${event.aggregateVersion}> on <${resourceName}> Event Store`
    );
  }
}
