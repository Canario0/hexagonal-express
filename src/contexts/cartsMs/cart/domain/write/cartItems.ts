import ValueObject from "../../../../shared/domain/valueObject/valueObject";
import ProductId from "../valueObject/productId";
import CartItem from "./cartItem";

export default class CartItems implements ValueObject<CartItems> {
  private _value: Map<string, CartItem>;

  constructor(items: CartItem[]) {
    this._value = new Map(items.map((item) => [item.productId.toString(), item]));
  }

  public get value() {
    return new Map(this._value);
  }

  public equals(o: CartItems): boolean {
    return Array.from(this._value.values()).every((item) => o.has(item.productId));
  }

  public toJSON() {
    return Array.from(this._value.values()).map((item) => item.toPrimitives());
  }

  public toString(): string {
    return JSON.stringify(
      Array.from(this._value.values()).map((item) => item.toPrimitives())
    );
  }

  public toCartItems() {
    return Array.from(this.value.values());
  }

  public has(productId: ProductId): boolean {
    return this._value.has(productId.toString());
  }

  public get(productId: ProductId): CartItem | null {
    const item = this._value.get(productId.toString());
    return item ?? null;
  }

  public add(item: CartItem): CartItems {
    const newValue = this.value.set(item.productId.toString(), item);
    return new CartItems(Array.from(newValue.values()));
  }

  public delete(productId: ProductId): CartItems {
    const newValue = this.value;
    newValue.delete(productId.toString());
    return new CartItems(Array.from(newValue.values()));
  }

  public static initialize(): CartItems {
    return new CartItems([]);
  }
}
