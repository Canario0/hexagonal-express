import CartNotFoundError from "../../domain/cartNotFoundError";
import CartRepository from "../../domain/cartRepository";
import CartId from "../../domain/valueObject/cartId";
import CartFindByIdResponse from "./cartFindByIdResponse";

export default class CartFindById {
  constructor(private cartRepository: CartRepository) {}

  async run(id: string): Promise<CartFindByIdResponse> {
    const cart = await this.cartRepository.findById(new CartId(id));
    if (cart === null) {
      throw new CartNotFoundError(id);
    }
    return new CartFindByIdResponse(cart);
  }
}
