import DomainEvent from "./domainEvent";

export default interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
}
