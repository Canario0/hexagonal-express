import DomainEvent, { DomainEventClass } from "./domainEvent";

export default abstract class DomainEventSubscriber<T extends DomainEvent> {
  abstract subscribedTo(): DomainEventClass[];
  abstract on(domainEvent: T): Promise<void>;
  abstract subscriberName(): string;
}
