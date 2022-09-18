import CartId from "../../../cart/domain/valueObject/cartId";
import CartExistsChecker from "../../../shared/domain/existsChecker/cartExistsChecker";
import CartItemViewRepository from "../../../cart/domain/read/cartItemViewRepository";
import CartItemFindAllResponse from "./cartItemFindAllResponse";
import CartViewRepository from "../../../cart/domain/read/cartViewRepository";

export default class CartItemFindAll {
  constructor(
    private cartItemRepository: CartItemViewRepository,
    private cartRepository: CartViewRepository
  ) {}

  public async run(id: string): Promise<CartItemFindAllResponse> {
    const cartId = new CartId(id);
    await this.ensureCartExists(cartId);
    const cartItems = await this.cartItemRepository.findAll(cartId);
    return new CartItemFindAllResponse(cartItems);
  }

  private async ensureCartExists(id: CartId) {
    await new CartExistsChecker(this.cartRepository).run(id);
  }
}
