import { v4 } from "uuid";
import validate from "uuid-validate";
import InvalidArgumentError from "../invalidArgumentError";
import ValueObject from "./valueObject";

export default class Uuid implements ValueObject<Uuid> {
  public readonly value: string;

  constructor(value: string) {
    this.ensureIsValidUuid(value);
    this.value = value;
  }

  static random(): Uuid {
    return new Uuid(v4());
  }

  public equals(o: Uuid): boolean {
    return this.value === o.value;
  }

  public toJSON(): string {
    return this.toString();
  }

  public toString(): string {
    return this.value;
  }

  private ensureIsValidUuid(id: string): void {
    if (!validate(id)) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${id}>`
      );
    }
  }
}
