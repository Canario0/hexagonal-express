import DomainEvent from "../../../shared/domain/eventBus/domainEvent";

type CartItemAddedDomainEventBody = {
  readonly id: string;
  readonly price: number;
  readonly cartId: string;
};

export default class CartItemAddedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME: string =
    "celtiFake.cartMs.1.event.cartItem.added";
  public readonly price: number;
  public readonly cartId: string;

  public constructor({
    id,
    price,
    cartId,
    eventId,
    occurredOn,
  }: {
    id: string;
    price: number;
    cartId: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super(CartItemAddedDomainEvent.EVENT_NAME, id, eventId, occurredOn);
    this.price = price;
    this.cartId = cartId;
  }

  public toPrimitive(): CartItemAddedDomainEventBody {
    return {
      id: this.aggregateId,
      price: this.price,
      cartId: this.cartId,
    };
  }

  public static fromPrimitives(
    aggregateId: string,
    body: CartItemAddedDomainEventBody,
    eventId: string,
    occurredOn: Date
  ): CartItemAddedDomainEvent {
    return new CartItemAddedDomainEvent({
      id: aggregateId,
      price: body.price,
      cartId: body.cartId,
      eventId,
      occurredOn,
    });
  }
}
