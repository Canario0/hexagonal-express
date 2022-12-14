import DomainEvent from "../../../../shared/domain/eventBus/domainEvent";

type CartCreatedDomainEventBody = {
  readonly id: string;
  readonly version: number;
  readonly userId: string;
  readonly validated: boolean;
};

export default class CartCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME: string = "celtiFake.cartMs.1.event.cart.created";
  public readonly userId: string;
  public readonly validated: boolean;

  public constructor({
    id,
    version,
    userId,
    validated,
    eventId,
    occurredOn,
  }: {
    id: string;
    version: number;
    userId: string;
    validated: boolean;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super(CartCreatedDomainEvent.EVENT_NAME, id, eventId, occurredOn, version);
    this.userId = userId;
    this.validated = validated;
  }

  public toPrimitive(): CartCreatedDomainEventBody {
    return {
      id: this.aggregateId,
      version: this.aggregateVersion!,
      userId: this.userId,
      validated: this.validated,
    };
  }

  public static fromPrimitives(
    aggregateId: string,
    body: CartCreatedDomainEventBody,
    eventId: string,
    occurredOn: Date
  ): CartCreatedDomainEvent {
    return new CartCreatedDomainEvent({
      id: aggregateId,
      version: body.version,
      userId: body.userId,
      validated: body.validated,
      eventId,
      occurredOn,
    });
  }
}
