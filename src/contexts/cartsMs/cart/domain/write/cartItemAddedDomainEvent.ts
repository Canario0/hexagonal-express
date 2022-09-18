import DomainEvent from "../../../../shared/domain/eventBus/domainEvent";

type CartItemAddedDomainEventBody = {
  readonly id: string;
  readonly version: number;
  readonly price: number;
  readonly productId: string;
};

export default class CartItemAddedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME: string =
    "celtiFake.cartMs.1.event.cartItem.added";
  public readonly price: number;
  public readonly productId: string;

  public constructor({
    id,
    version,
    price,
    productId,
    eventId,
    occurredOn,
  }: {
    id: string;
    version: number;
    price: number;
    productId: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super(
      CartItemAddedDomainEvent.EVENT_NAME,
      id,
      eventId,
      occurredOn,
      version
    );
    this.price = price;
    this.productId = productId;
  }

  public toPrimitive(): CartItemAddedDomainEventBody {
    return {
      id: this.aggregateId,
      version: this.aggregateVersion!,
      price: this.price,
      itemId: this.productId,
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
      version: body.version,
      price: body.price,
      productId: body.productId,
      eventId,
      occurredOn,
    });
  }
}
