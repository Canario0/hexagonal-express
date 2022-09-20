import CartNotFoundError from "../../../domain/cartNotFoundError";
import CartViewRepository from "../../../domain/read/cartViewRepository";
import CartId from "../../../domain/valueObject/cartId";
import CartFindByIdResponse from "./cartFindByIdResponse";

export default class CartViewFindById {
  constructor(private cartRepository: CartViewRepository) {}

  async run(id: string): Promise<CartFindByIdResponse> {
    const cart = await this.cartRepository.findById(new CartId(id));
    if (cart === null) {
      throw new CartNotFoundError(id);
    }
    return new CartFindByIdResponse(cart);
  }
}
