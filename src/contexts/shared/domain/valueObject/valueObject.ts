export default interface ValueObject<T> {
  equals(o: T): boolean;
  toJSON(): string;
  toString(): string;
}
