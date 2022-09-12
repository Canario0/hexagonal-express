import Uuid from "../valueObject/uuid";

export default abstract class DomainEvent {
  static EVENT_NAME: string;
  static fromPrimitives: (...args: any[]) => any;
  readonly aggregateId: string;
  readonly aggregateVersion?: number;
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventName: string;

  constructor(
    eventName: string,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date,
    aggregateVersion?: number
  ) {
    this.aggregateId = aggregateId;
    this.eventId = eventId || Uuid.random().value;
    this.occurredOn = occurredOn || new Date();
    this.eventName = eventName;
    this.aggregateVersion = aggregateVersion;
  }

  abstract toPrimitive(): Object;
}

export type DomainEventClass = {
  EVENT_NAME: string;
  fromPrimitives(...args: any[]): DomainEvent;
};
