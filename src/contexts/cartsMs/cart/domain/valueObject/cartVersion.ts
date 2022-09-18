import InvalidArgumentError from "../../../../shared/domain/invalidArgumentError";
import ValueObject from "../../../../shared/domain/valueObject/valueObject";

export default class CartVersion implements ValueObject<CartVersion> {
  public readonly value: number;

  constructor(value: number) {
    this.ensureExists(value);
    this.ensureNonNegative(value);
    this.value = value;
  }

  public equals(o: CartVersion): boolean {
    return this.value === o.value;
  }

  public toJSON(): string {
    return this.toString();
  }

  public toString(): string {
    return this.value.toString();
  }

  public increment(): CartVersion {
    return new CartVersion(this.value + 1);
  }

  static initialize(): CartVersion {
    return new CartVersion(0);
  }

  private ensureExists(value: number) {
    if (value == null) {
      throw new InvalidArgumentError(`The Version must be set.`);
    }
  }

  private ensureNonNegative(value: number) {
    if (value < 0) {
      throw new InvalidArgumentError(
        `The Version must be equals or greater to 0.`
      );
    }
  }
}
