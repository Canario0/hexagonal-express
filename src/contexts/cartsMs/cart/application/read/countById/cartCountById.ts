import CartViewRepository from "../../../domain/read/cartViewRepository";
import CartId from "../../../domain/valueObject/cartId";
import CartCountByIdResponse from "./cartCountByIdResponse";

export default class CartCountById {
  constructor(private cartRepository: CartViewRepository) {}

  public async run(id: string): Promise<CartCountByIdResponse> {
    const cartId = new CartId(id);
    const cartCount = await this.cartRepository.countById(cartId);
    return new CartCountByIdResponse(cartCount);
  }
}
