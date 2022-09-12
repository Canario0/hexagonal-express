export default class CartNotFoundError extends Error {
  constructor(id: string) {
    super(`Cart with id '${id}' not found.`);
  }
}
