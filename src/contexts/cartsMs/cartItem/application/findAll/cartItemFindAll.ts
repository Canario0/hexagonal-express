import CartRepository from "../../../cart/domain/cartRepository";
import CartId from "../../../cart/domain/valueObject/cartId";
import CartExistsChecker from "../../../shared/domain/existsChecker/cartExistsChecker";
import CartItem from "../../domain/cartItem";
import CartItemRepository from "../../domain/cartItemRepository";

export default class CartItemFindAll {
  constructor(
    private cartItemRepository: CartItemRepository,
    private cartRepository: CartRepository
  ) {}

  public async run(id: string): Promise<CartItem[]> {
    const cartId = new CartId(id);
    await this.ensureCartExists(cartId);
    return await this.cartItemRepository.findAll(cartId);
  }

  private async ensureCartExists(id: CartId) {
    await new CartExistsChecker(this.cartRepository).run(id);
  }
}
