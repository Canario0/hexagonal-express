import Query from "../../../../../shared/domain/queryBus/query";
import QueryHandler from "../../../../../shared/domain/queryBus/queryHandler";
import CartCountById from "./cartCountById";
import CartCountByIdQuery from "./cartCountByIdQuery";
import CartCountByIdResponse from "./cartCountByIdResponse";

export default class CartCountByIdQueryHandler
  implements QueryHandler<CartCountByIdQuery, CartCountByIdResponse>
{
  constructor(private cartCountById: CartCountById) {}

  subscribedTo(): Query {
    return CartCountByIdQuery;
  }

  async handle(query: CartCountByIdQuery): Promise<CartCountByIdResponse> {
    return this.cartCountById.run(query.cartId);
  }
}
