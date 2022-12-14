import Query from "../../../../../shared/domain/queryBus/query";
import QueryHandler from "../../../../../shared/domain/queryBus/queryHandler";
import CartViewFindById from "./cartFindById";
import CartFindByIdQuery from "./cartFindByIdQuery";
import CartFindByIdResponse from "./cartFindByIdResponse";

export default class CartFindByIdQueryHandler
  implements QueryHandler<CartFindByIdQuery, CartFindByIdResponse>
{
  constructor(private cartFindById: CartViewFindById) {}

  subscribedTo(): Query {
    return CartFindByIdQuery;
  }

  async handle(query: CartFindByIdQuery): Promise<CartFindByIdResponse> {
    return this.cartFindById.run(query.id);
  }
}
