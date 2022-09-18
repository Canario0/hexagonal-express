import { DataSource, Repository } from "typeorm";
import TypeORMDomainEvent from "./entities/typeOrmEvent";
import DomainEvent from "../../../../shared/domain/eventBus/domainEvent";
import ConcurrencyError from "../../domain/concurrencyError";

export default abstract class TypeORMEventStore {
  constructor(private client: Promise<DataSource>) {}

  protected async getRepository(): Promise<Repository<TypeORMDomainEvent>> {
    return (await this.client).getRepository(TypeORMDomainEvent);
  }

  private async rollback(ids: string[]) {
    const eventRepository = await this.getRepository();
    await eventRepository.delete(ids);
  }

  public async apply(events: DomainEvent[]): Promise<void> {
    const eventRepository = await this.getRepository();
    const insertedEventIds: string[] = [];
    for (const event of events) {
      try {
        const primitiveEvent = this.serialize(event);
        await eventRepository.insert(primitiveEvent);
        insertedEventIds.push(event.eventId);
      } catch (err) {
        this.rollback(insertedEventIds);
        throw new ConcurrencyError(this.constructor.name, event);
      }
    }
  }

  private serialize(event: DomainEvent) {
    return {
      id: event.eventId,
      name: event.eventName,
      aggregateId: event.aggregateId,
      occurredOn: event.occurredOn,
      aggregateVersion: event.aggregateVersion,
      body: event.toPrimitive(),
    };
  }
}
