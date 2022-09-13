import AggregateRoot from "../../../shared/domain/aggregateRoot";
import CartItem from "../../cartItem/domain/cartItem";
import CartId from "./valueObject/cartId";
import CartItems from "./valueObject/cartItems";
import CartValidated from "./valueObject/cartValidated";
import UserId from "./valueObject/userId";

export default class Cart extends AggregateRoot {
  public readonly id: CartId;
  public readonly userId: UserId;
  private _validated: CartValidated;
  private _items: CartItems;

  public constructor(
    id: CartId,
    userId: UserId,
    validated: CartValidated,
    items: CartItems
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
    const cartItems = data.items.map((item) => CartItem.fromPrimitives(item));
    return new Cart(
      new CartId(data.id),
      new UserId(data.userId),
      new CartValidated(data.validated),
      new CartItems(cartItems)
    );
  }

  public static create(id: CartId, userId: UserId) {
    return new Cart(
      id,
      userId,
      CartValidated.initialize(),
      CartItems.initialize()
    );
  }
}
