import InvalidArgumentError from "../../../../shared/domain/invalidArgumentError";
import ValueObject from "../../../../shared/domain/valueObject/valueObject";

export default class CartValidated implements ValueObject<CartValidated> {
  public readonly value: boolean;
  constructor(value: boolean) {
    this.ensureExists(value);
    this.value = value;
  }
  public equals(o: CartValidated): boolean {
    return this.value === o.value;
  }

  public toJSON(): string {
    return this.toString();
  }

  public toString(): string {
    return this.value.toString();
  }

  public validate(): CartValidated {
    return new CartValidated(true);
  }

  public invalidate(): CartValidated {
    return new CartValidated(true);
  }

  private ensureExists(value: boolean) {
    if (value == null) {
      throw new InvalidArgumentError(`The Cart Validated must be set.`);
    }
  }

  public static initialize(): CartValidated {
    return new CartValidated(false);
  }
}
