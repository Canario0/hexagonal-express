import AggregateRoot from "../../../../shared/domain/aggregateRoot";
import CartItemView from "./cartItemView";
import CartId from "../valueObject/cartId";
import CartValidated from "../valueObject/cartValidated";
import UserId from "../valueObject/userId";
import CartItemsView from "./cartItemsView";

export default class CartView extends AggregateRoot {
  public readonly id: CartId;
  public readonly userId: UserId;
  private _validated: CartValidated;
  private _items: CartItemsView;

  public constructor(
    id: CartId,
    userId: UserId,
    validated: CartValidated,
    items: CartItemsView
  ) {
    super();
    this.id = id;
    this.userId = userId;
    this._validated = validated;
    this._items = items;
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
      userId: this.userId.toString(),
      validated: this.validated,
      items: this.items.toCartItems().map((item) => item.toPrimitives()),
    };
  }

  public static fromPrimitives(data: {
    id: string;
    userId: string;
    validated: boolean;
    items: { id: string; price: number; count: number; cartId: string }[];
  }) {
    const cartItems = data.items.map((item) =>
      CartItemView.fromPrimitives(item)
    );
    return new CartView(
      new CartId(data.id),
      new UserId(data.userId),
      new CartValidated(data.validated),
      new CartItemsView(cartItems)
    );
  }

  public static create(id: CartId, userId: UserId) {
    const cart = new CartView(
      id,
      userId,
      CartValidated.initialize(),
      CartItemsView.initialize()
    );
    return cart;
  }
}
