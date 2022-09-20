import CartCountById from "../../../../../../../contexts/cartsMs/cart/application/read/countById/cartCountById";
import CartCountByIdQueryHandler from "../../../../../../../contexts/cartsMs/cart/application/read/countById/cartCountByIdQueryHandler";
import CartItemViewFindAll from "../../../../../../../contexts/cartsMs/cart/application/read/findAllItemsByCart/cartItemFindAll";
import CartItemFindAllQuery from "../../../../../../../contexts/cartsMs/cart/application/read/findAllItemsByCart/cartItemFindAllQuery";
import CartItemFindAllQueryHandler from "../../../../../../../contexts/cartsMs/cart/application/read/findAllItemsByCart/cartItemFindAllQueryHandler";
import CartItemFindAllResponse from "../../../../../../../contexts/cartsMs/cart/application/read/findAllItemsByCart/cartItemFindAllResponse";
import CartNotFoundError from "../../../../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartItemView from "../../../../../../../contexts/cartsMs/cart/domain/read/cartItemView";
import CartCount from "../../../../../../../contexts/cartsMs/cart/domain/valueObject/cartCount";
import CartItemCount from "../../../../../../../contexts/cartsMs/cart/domain/valueObject/cartItemCount";
import Price from "../../../../../../../contexts/cartsMs/cart/domain/valueObject/price";
import InvalidArgumentError from "../../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../../contexts/shared/domain/valueObject/uuid";
import InMemoryQueryBus from "../../../../../../../contexts/shared/infrastructure/queryBus/inMemoryQueryBus";
import QueryHandlersMapper from "../../../../../../../contexts/shared/infrastructure/queryBus/queryHandlersMapper";
import CartItemViewRepositoryMock from "../../../__mocks__/cartItemViewRepositoryMock";
import CartViewRepositoryMock from "../../../__mocks__/cartViewRepositoryMock";

describe("CartItemFindAll Test Suit", () => {
  let cartViewRepository: CartViewRepositoryMock;
  let cartItemViewRepository: CartItemViewRepositoryMock;
  let queryBus: InMemoryQueryBus;
  beforeAll(() => {
    queryBus = new InMemoryQueryBus();
    cartViewRepository = new CartViewRepositoryMock();
    const countByIdService = new CartCountById(cartViewRepository);
    const cartCountByIdQueryHandler = new CartCountByIdQueryHandler(
      countByIdService
    );
    cartItemViewRepository = new CartItemViewRepositoryMock();
    const service = new CartItemViewFindAll(cartItemViewRepository, queryBus);
    const queryHandler = new CartItemFindAllQueryHandler(service);

    const queryhandlersMapper = new QueryHandlersMapper([
      queryHandler,
      cartCountByIdQueryHandler,
    ]);
    queryBus.queryHandlersMapper = queryhandlersMapper;
  });

  it("Should rise on Invalid Cart Id", async () => {
    // Given
    const query = new CartItemFindAllQuery("NonUUID");
    // When/Then
    await expect(queryBus.ask(query)).rejects.toThrow(InvalidArgumentError);
  });

  it("Should rise on Missing Cart Error", async () => {
    // Given
    const missingCartId = Uuid.random();
    cartViewRepository.whenCountByIdReturn(new CartCount(0));
    const query = new CartItemFindAllQuery(missingCartId.toString());
    // When/Then
    await expect(queryBus.ask(query)).rejects.toThrow(CartNotFoundError);
  });

  it("Should return a list of cart items.", async () => {
    // Given
    const validCartId = Uuid.random();
    cartViewRepository.whenCountByIdReturn(new CartCount(1));
    const item1 = new CartItemView(
      Uuid.random(),
      new Price(3),
      new CartItemCount(2),
      validCartId
    );
    const item2 = new CartItemView(
      Uuid.random(),
      new Price(0.5),
      new CartItemCount(4),
      validCartId
    );
    cartItemViewRepository.whenFindAllReturn([item1, item2]);
    const query = new CartItemFindAllQuery(validCartId.toString());
    // When
    const cartItemsReponse: CartItemFindAllResponse = await queryBus.ask(query);
    const cartItems = cartItemsReponse.cartItems;
    // Then
    expect(cartItems).toHaveLength(2);
    expect(item1.toPrimitives()).toEqual(cartItems[0].toPrimitives());
    expect(item2.toPrimitives()).toEqual(cartItems[1].toPrimitives());
  });
});
