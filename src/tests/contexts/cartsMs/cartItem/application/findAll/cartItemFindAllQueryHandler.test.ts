import CartNotFoundError from "../../../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartCount from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartCount";
import CartItemFindAll from "../../../../../../contexts/cartsMs/cartItem/application/findAll/cartItemFindAll";
import CartItemFindAllQuery from "../../../../../../contexts/cartsMs/cartItem/application/findAll/cartItemFindAllQuery";
import CartItemFindAllQueryHandler from "../../../../../../contexts/cartsMs/cartItem/application/findAll/cartItemFindAllQueryHandler";
import CartItemFindAllResponse from "../../../../../../contexts/cartsMs/cartItem/application/findAll/cartItemFindAllResponse";
import CartItemView from "../../../../../../contexts/cartsMs/cart/domain/read/cartItemView";
import CartItemCount from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartItemCount";
import InvalidArgumentError from "../../../../../../contexts/shared/domain/invalidArgumentError";
import QueryBus from "../../../../../../contexts/shared/domain/queryBus/queryBus";
import Uuid from "../../../../../../contexts/shared/domain/valueObject/uuid";
import InMemoryQueryBus from "../../../../../../contexts/shared/infrastructure/queryBus/inMemoryQueryBus";
import QueryHandlersMapper from "../../../../../../contexts/shared/infrastructure/queryBus/queryHandlersMapper";
import CartRepositoryMock from "../../../cart/__mocks__/cartRepositoryMock";
import CartItemRepositoryMock from "../../__mocks__/cartItemRepositoryMock";
import Price from "../../../../../../contexts/cartsMs/cart/domain/valueObject/price";

describe("CartItemFindAll Test Suit", () => {
  let cartRepository: CartRepositoryMock;
  let cartItemRepository: CartItemRepositoryMock;
  let queryBus: QueryBus;
  beforeAll(() => {
    cartRepository = new CartRepositoryMock();
    cartItemRepository = new CartItemRepositoryMock();
    const service = new CartItemFindAll(cartItemRepository, cartRepository);
    const queryHandler = new CartItemFindAllQueryHandler(service);
    const queryhandlersMapper = new QueryHandlersMapper([queryHandler]);
    queryBus = new InMemoryQueryBus(queryhandlersMapper);
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
    cartRepository.whenCountByIdReturn(new CartCount(0));
    const query = new CartItemFindAllQuery(missingCartId.toString());
    // When/Then
    await expect(queryBus.ask(query)).rejects.toThrow(CartNotFoundError);
  });

  it("Should return a list of cart items.", async () => {
    // Given
    const validCartId = Uuid.random();
    cartRepository.whenCountByIdReturn(new CartCount(1));
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
    cartItemRepository.whenFindAllReturn([item1, item2]);
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
