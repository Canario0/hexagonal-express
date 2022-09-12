export default interface ValueObject<T> {
  equals(o: T): boolean;
  toJSON(): unknown;
  toString(): string;
}
