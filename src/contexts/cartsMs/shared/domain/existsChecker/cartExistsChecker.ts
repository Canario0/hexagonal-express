import QueryBus from "../../../../shared/domain/queryBus/queryBus";
import CartCountByIdQuery from "../../../cart/application/read/countById/cartCountByIdQuery";
import CartCountByIdResponse from "../../../cart/application/read/countById/cartCountByIdResponse";
import CartNotFoundError from "../../../cart/domain/cartNotFoundError";
import CartId from "../../../cart/domain/valueObject/cartId";

export default class CartExistsChecker {
  constructor(private queryBus: QueryBus) {}

  public async run(id: CartId) {
    const query = new CartCountByIdQuery(id.toString());
    const cartCountResponse: CartCountByIdResponse = await this.queryBus.ask(
      query
    );
    if (cartCountResponse.count.value === 0) {
      throw new CartNotFoundError(id.toString());
    }
  }
}
