import ValueObject from "../../../../shared/domain/valueObject/valueObject";
import ProductId from "../valueObject/productId";
import CartItemView from "./cartItemView";

export default class CartItemsView implements ValueObject<CartItemsView> {
  private _value: Map<string, CartItemView>;

  constructor(items: CartItemView[]) {
    this._value = new Map(items.map((item) => [item.productId.toString(), item]));
  }

  public get value() {
    return new Map(this._value);
  }

  public equals(o: CartItemsView): boolean {
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

  public get(productId: ProductId): CartItemView | null {
    const item = this._value.get(ProductId.toString());
    return item ?? null;
  }

  public add(item: CartItemView): CartItemsView {
    const newValue = this.value.set(item.productId.toString(), item);
    return new CartItemsView(Array.from(newValue.values()));
  }

  public delete(productId: ProductId): CartItemsView {
    const newValue = this.value;
    newValue.delete(productId.toString());
    return new CartItemsView(Array.from(newValue.values()));
  }

  public static initialize(): CartItemsView {
    return new CartItemsView([]);
  }
}
