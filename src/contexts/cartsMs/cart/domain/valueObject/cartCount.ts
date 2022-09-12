import InvalidArgumentError from "../../../../shared/domain/invalidArgumentError";
import ValueObject from "../../../../shared/domain/valueObject/valueObject";

export default class CartCount implements ValueObject<CartCount> {
  public readonly value: number;
  constructor(value: number) {
    this.ensureExists(value);
    this.value = value;
  }
  public equals(o: CartCount): boolean {
    return this.value === o.value;
  }

  public toJSON(): number {
    return this.value;
  }

  public toString(): string {
    return this.value.toString();
  }

  private ensureExists(value: number) {
    if (value == null) {
      throw new InvalidArgumentError(`The Cart Count must be set.`);
    }
  }
}
