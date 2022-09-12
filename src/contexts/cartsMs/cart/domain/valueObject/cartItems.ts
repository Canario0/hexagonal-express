import ValueObject from "../../../../shared/domain/valueObject/valueObject";
import CartItem from "../cartItem";
import CartItemId from "./cartItemId";

export default class CartItems implements ValueObject<CartItems> {
  private _value: Map<string, CartItem>;

  constructor(items: CartItem[]) {
    this._value = new Map(items.map((item) => [item.id.toString(), item]));
  }

  public get value() {
    return new Map(this._value);
  }

  public equals(o: CartItems): boolean {
    return Array.from(this._value.values()).every((item) => o.has(item.id));
  }

  public toJSON(): string {
    return this.toString();
  }

  public toString(): string {
    return JSON.stringify(
      Array.from(this._value.values()).map((item) => item.toPrimitives())
    );
  }

  public toCartItems() {
    return Array.from(this.value.values());
  }

  public has(id: CartItemId): boolean {
    return this._value.has(id.toString());
  }

  public get(id: CartItemId): CartItem | null {
    const item = this._value.get(id.toString());
    return item ?? null;
  }

  public add(item: CartItem): CartItems {
    const newValue = this.value.set(item.id.toString(), item);
    return new CartItems(Array.from(newValue.values()));
  }

  public delete(id: CartItemId): CartItems {
    const newValue = this.value;
    newValue.delete(id.toString());
    return new CartItems(Array.from(newValue.values()));
  }

  public static initialize(): CartItems {
    return new CartItems([]);
  }
}
