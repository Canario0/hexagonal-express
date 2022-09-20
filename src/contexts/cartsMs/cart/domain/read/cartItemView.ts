import AggregateRoot from "../../../../shared/domain/aggregateRoot";
import CartId from "../valueObject/cartId";
import CartItemCount from "../valueObject/cartItemCount";
import ProductId from "../valueObject/productId";
import Price from "../valueObject/price";

export default class CartItemView extends AggregateRoot {
  public readonly productId: ProductId;
  public readonly price: Price;
  public readonly cartId: CartId;
  private _count: CartItemCount;

  constructor(
    productId: ProductId,
    price: Price,
    count: CartItemCount,
    cartId: CartId
  ) {
    super();
    this.productId = productId;
    this.price = price;
    this._count = count;
    this.cartId = cartId;
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
      productId: this.productId.toString(),
      price: this.price.value,
      count: this.count.value,
      cartId: this.cartId.toString(),
    };
  }

  public static fromPrimitives(data: {
    productId: string;
    price: number;
    count: number
    cartId: string;
  }) {
    return new CartItemView(
      new ProductId(data.productId),
      new Price(data.price),
      new CartItemCount(data.count),
      new CartId(data.cartId)
    );
  }

  public static create(productId: ProductId, price: Price, cartId: CartId) {
    const cart = new CartItemView(
      productId,
      price,
      CartItemCount.initialize(),
      cartId
    );
    return cart;
  }
}
