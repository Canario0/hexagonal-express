import CartRepository from "../../../cart/domain/cartRepository";
import CartId from "../../../cart/domain/valueObject/cartId";
import CartExistsChecker from "../../../shared/domain/existsChecker/cartExistsChecker";
import CartItemRepository from "../../domain/cartItemRepository";
import CartItemFindAllResponse from "./cartItemFindAllResponse";

export default class CartItemFindAll {
  constructor(
    private cartItemRepository: CartItemRepository,
    private cartRepository: CartRepository
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
