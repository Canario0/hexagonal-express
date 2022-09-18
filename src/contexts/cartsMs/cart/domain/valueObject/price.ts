import InvalidArgumentError from "../../../../shared/domain/invalidArgumentError";
import ValueObject from "../../../../shared/domain/valueObject/valueObject";

export default class Price implements ValueObject<Price> {
  public readonly value: number;

  constructor(value: number) {
    this.ensureExists(value);
    this.ensureNonNegative(value);
    this.value = value;
  }

  public equals(o: Price): boolean {
    return this.value === o.value;
  }

  public toJSON(): string {
    return this.toString();
  }

  public toString(): string {
    return this.value.toString();
  }

  private ensureExists(value: number) {
    if (value == null) {
      throw new InvalidArgumentError(`The Money must be set.`);
    }
  }

  private ensureNonNegative(value: number) {
    if (value < 0) {
      throw new InvalidArgumentError(
        `The Price must be equals or greater to 0.`
      );
    }
  }
}
