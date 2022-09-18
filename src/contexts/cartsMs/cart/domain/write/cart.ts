import DomainEvent from "../../../../shared/domain/eventBus/domainEvent";
import {
  EventSourceAggregateRoot,
  EventSourcingAggregate,
  EventSourcingSubscriber,
} from "../../../shared/domain/eventSourceAggregateRoot";
import CartId from "../valueObject/cartId";
import ProductId from "../valueObject/productId";
import CartValidated from "../valueObject/cartValidated";
import CartVersion from "../valueObject/cartVersion";
import Price from "../valueObject/price";
import UserId from "../valueObject/userId";
import CartCreatedDomainEvent from "./cartCreatedDomainEvent";
import CartItemAddedDomainEvent from "./cartItemAddedDomainEvent";
import CartItems from "./cartItems";
import CartItem from "./cartItem";

@EventSourcingAggregate
export default class Cart extends EventSourceAggregateRoot {
  private _id!: CartId;
  private _version!: CartVersion;
  private _userId!: UserId;
  private _validated!: CartValidated;
  private _items!: CartItems;

  public get id() {
    return this._id;
  }

  public get version() {
    return this._version;
  }

  public get userId() {
    return this._userId;
  }

  public get validated() {
    return this._validated;
  }

  public get items() {
    return this._items;
  }

  // TODO: add logic to compute total cost...

  public toPrimitives() {
    return {
      id: this.id.toString(),
      version: this.version.value,
      userId: this.userId.toString(),
      validated: this.validated,
      items: this.items.toCartItems().map((item) => item.toPrimitives()),
    };
  }

  public addItem(productId: ProductId, price: Price) {
    this.record(
      new CartItemAddedDomainEvent({
        id: this.id.toString(),
        version: this.version.increment().value,
        price: price.value,
        productId: productId.toString(),
      })
    );
  }

  public static loadEvents(events: DomainEvent[]): Cart {
    const wallet = new Cart();
    events.forEach((event) => wallet.playEvent(event));
    return wallet;
  }

  public static create(id: CartId, userId: UserId) {
    const cart = new Cart();
    cart.record(
      new CartCreatedDomainEvent({
        id: cart.id.toString(),
        version: CartVersion.initialize().value,
        userId: cart.userId.toString(),
        validated: CartValidated.initialize().value,
      })
    );
    return cart;
  }

  @EventSourcingSubscriber([CartCreatedDomainEvent])
  private onCartCreatedDomainEvent(event: CartCreatedDomainEvent) {
    this._id = new CartId(event.aggregateId);
    this._version = new CartVersion(event.aggregateVersion!);
    this._userId = new UserId(event.userId);
    this._items = new CartItems([]);
  }

  @EventSourcingSubscriber([CartItemAddedDomainEvent])
  private onCartItemAddedDomainEvent(event: CartItemAddedDomainEvent) {
    const productId = new ProductId(event.productId);
    let cartItem;

    if (this.items.has(productId)) {
      cartItem = this.items.get(productId);
      cartItem!.incrementCount();
    } else {
      cartItem = CartItem.create(
        productId,
        new Price(event.price),
        new CartId(event.aggregateId)
      );
    }

    this._items = this.items.add(cartItem!);
  }
}
