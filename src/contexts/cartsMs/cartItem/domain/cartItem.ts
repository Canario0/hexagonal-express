import AggregateRoot from "../../../shared/domain/aggregateRoot";
import CartId from "../../cart/domain/valueObject/cartId";
import CartItemAddedDomainEvent from "./cartItemAddedDomainEvent";
import CartItemCount from "./valueObject/cartItemCount";
import CartItemId from "./valueObject/cartItemId";
import { Price } from "./valueObject/price";

export default class CartItem extends AggregateRoot {
  public readonly id: CartItemId;
  public readonly price: Price;
  public readonly cartId: CartId;
  private _count: CartItemCount;

  constructor(
    id: CartItemId,
    price: Price,
    count: CartItemCount,
    cartId: CartId
  ) {
    super();
    this.id = id;
    this.price = price;
    this._count = count;
    this.cartId = cartId;
  }

  public get count() {
    return this._count;
  }

  public incrementCount() {
    this._count = this.count.increment();
    this.record(
      new CartItemAddedDomainEvent({
        id: this.id.toString(),
        price: this.price.value,
        cartId: this.cartId.toString(),
      })
    );
  }

  public reduceCount() {
    this._count = this.count.reduce();
  }

  public toPrimitives() {
    return {
      id: this.id.toString(),
      price: this.price.value,
      count: this.count.value,
      cartId: this.cartId.toString(),
    };
  }

  public static fromPrimitives(data: {
    id: string;
    price: number;
    count: number;
    cartId: string;
  }) {
    return new CartItem(
      new CartItemId(data.id),
      new Price(data.price),
      new CartItemCount(data.count),
      new CartId(data.cartId)
    );
  }

  public static create(id: CartItemId, price: Price, cartId: CartId) {
    const cart = new CartItem(id, price, CartItemCount.initialize(), cartId);
    cart.record(
      new CartItemAddedDomainEvent({
        id: cart.id.toString(),
        price: cart.price.value,
        cartId: cart.cartId.toString(),
      })
    );
    return cart;
  }
}
