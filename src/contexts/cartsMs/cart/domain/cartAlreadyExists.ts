export default class CartAlreadyExists extends Error {
  constructor(id: string) {
    super(`Cart with id '${id}' already exists`);
  }
}
