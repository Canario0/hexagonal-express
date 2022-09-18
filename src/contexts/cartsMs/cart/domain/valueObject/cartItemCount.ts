import InvalidArgumentError from "../../../../shared/domain/invalidArgumentError";
import ValueObject from "../../../../shared/domain/valueObject/valueObject";

export default class CartItemCount implements ValueObject<CartItemCount> {
  public readonly value: number;
  constructor(value: number) {
    this.ensureExists(value);
    this.ensureNonNegatives(value);
    this.value = value;
  }
  public equals(o: CartItemCount): boolean {
    return this.value === o.value;
  }

  public toJSON(): string {
    return this.toString();
  }

  public toString(): string {
    return this.value.toString();
  }

  public increment(): CartItemCount {
    return new CartItemCount(this.value + 1);
  }

  public reduce(): CartItemCount {
    return new CartItemCount(this.value - 1);
  }

  public static initialize(): CartItemCount {
    return new CartItemCount(1);
  }

  private ensureExists(value: number) {
    if (value == null) {
      throw new InvalidArgumentError(`The Cart Item Count must be set.`);
    }
  }

  private ensureNonNegatives(value: number) {
    if (value <= 0) {
      throw new InvalidArgumentError(
        `The Cart Item Count must be greater than 0.`
      );
    }
  }
}
