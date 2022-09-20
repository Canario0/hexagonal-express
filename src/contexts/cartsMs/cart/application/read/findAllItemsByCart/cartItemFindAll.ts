import QueryBus from "../../../../../shared/domain/queryBus/queryBus";
import CartExistsChecker from "../../../../shared/domain/existsChecker/cartExistsChecker";
import CartItemViewRepository from "../../../domain/read/cartItemViewRepository";
import CartId from "../../../domain/valueObject/cartId";
import CartItemFindAllResponse from "./cartItemFindAllResponse";

export default class CartItemFindAll {
  constructor(
    private cartItemRepository: CartItemViewRepository,
    private queryBus: QueryBus
  ) {}

  public async run(id: string): Promise<CartItemFindAllResponse> {
    const cartId = new CartId(id);
    await this.ensureCartExists(cartId);
    const cartItems = await this.cartItemRepository.findAll(cartId);
    return new CartItemFindAllResponse(cartItems);
  }

  private async ensureCartExists(id: CartId) {
    await new CartExistsChecker(this.queryBus).run(id);
  }
}
