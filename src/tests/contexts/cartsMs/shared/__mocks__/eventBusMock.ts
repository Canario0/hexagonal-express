import DomainEvent from "../../../../../contexts/shared/domain/eventBus/domainEvent";
import EventBus from "../../../../../contexts/shared/domain/eventBus/eventBus";

export default class EventBusMock implements EventBus {
  private mockPublish = jest.fn();

  public async publish(events: DomainEvent[]): Promise<void> {
    this.mockPublish(events);
  }

  public lastPublishedEvents(): DomainEvent[] {
    const mock = this.mockPublish.mock;
    return mock.calls[mock.calls.length - 1][0] as DomainEvent[];
  }
}
