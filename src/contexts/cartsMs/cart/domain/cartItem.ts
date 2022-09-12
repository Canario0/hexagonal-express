import AggregateRoot from "../../../shared/domain/aggregateRoot";
import CartItemCount from "./valueObject/cartItemCount";
import CartItemId from "./valueObject/cartItemId";
import { Price } from "./valueObject/price";

export default class CartItem extends AggregateRoot {
  public readonly id: CartItemId;
  public readonly price: Price;
  private _count: CartItemCount;

  constructor(id: CartItemId, price: Price, count: CartItemCount) {
    super();
    this.id = id;
    this.price = price;
    this._count = count;
  }

  public get count() {
    return this._count;
  }

  public incrementCount() {
    this._count = this.count.increment();
  }

  public reduceCount() {
    this._count = this.count.reduce();
  }

  public toPrimitives() {
    return {
      id: this.id.toString(),
      price: this.price.value,
      count: this.count.value,
    };
  }

  public static fromPrimitives(data: {
    id: string;
    price: number;
    count: number;
  }) {
    return new CartItem(
      new CartItemId(data.id),
      new Price(data.price),
      new CartItemCount(data.count)
    );
  }

  public static create(id: CartItemId, price: Price, count: CartItemCount) {
    return new CartItem(id, price, count);
  }
}
