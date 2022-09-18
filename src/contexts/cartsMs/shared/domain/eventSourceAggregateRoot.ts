import AggregateRoot from "../../../shared/domain/aggregateRoot";
import DomainEvent, {
  DomainEventClass,
} from "../../../shared/domain/eventBus/domainEvent";
import EventSourceNotRegistered from "./eventSourceNotRegisteredError";
import EventSourcingSubscriberNotRegistered from "./eventSourcingSubscriberNotFounError";

type EventSourcingMethodType = (event: DomainEvent) => void;

export abstract class EventSourceAggregateRoot extends AggregateRoot {
  public static eventFor: (name: string) => DomainEventClass | undefined;
  public playEvent!: EventSourcingMethodType;

  public apply(event: DomainEvent): void {
    this.playEvent(event);
    this.record(event);
  }
}

const EventSourcingSubscribersMappingSymbol = Symbol(
  "eventSourcingSubscribersMapping"
);
const PrototypeEventMappingSymbol = Symbol("eventMapping");

export function EventSourcingSubscriber(events: DomainEventClass[]) {
  return function (prototype: any, propertyKey: string) {
    prototype[EventSourcingSubscribersMappingSymbol] =
      prototype[EventSourcingSubscribersMappingSymbol] ??
      new Map<string, string>();
    prototype[PrototypeEventMappingSymbol] =
      prototype[PrototypeEventMappingSymbol] ?? new Map<string, DomainEvent>();

    events.forEach((event) => {
      prototype[EventSourcingSubscribersMappingSymbol].set(
        event.EVENT_NAME,
        propertyKey
      );
      prototype[PrototypeEventMappingSymbol].set(event.EVENT_NAME, event);
    });
  };
}

type FunctionTypeOnlyMembers<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export function EventSourcingAggregate<T extends { new (...args: any[]): {} }>(
  Base: T
) {
  return class extends Base {
    public static eventFor(name: string): DomainEventClass | undefined {
      const eventMapping = Base.prototype[PrototypeEventMappingSymbol];
      return eventMapping.get(name);
    }

    public playEvent(event: DomainEvent) {
      const mapping: Map<string, string> =
        Base.prototype[EventSourcingSubscribersMappingSymbol];
      const subscriberKey = mapping.get(event.eventName);

      if (subscriberKey == null) {
        throw new EventSourceNotRegistered(event);
      }
      const subscriber = this[
        subscriberKey as FunctionTypeOnlyMembers<typeof this>
      ] as unknown as EventSourcingMethodType;
      if (subscriber == null) {
        throw new EventSourcingSubscriberNotRegistered(subscriberKey);
      }

      subscriber.bind(this)(event);
    }
  };
}
