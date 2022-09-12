import DomainEvent from "./eventBus/domainEvent";

export default abstract class AggregateRoot {
  private domainEvents: DomainEvent[];

  constructor() {
    this.domainEvents = [];
  }

  public pullDomainEvents(): DomainEvent[] {
    const domainEvents = this.domainEvents.slice();
    this.domainEvents = [];

    return domainEvents;
  }

  public record(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  abstract toPrimitives(): any;
}
