import CartFindById from "../../../../../../contexts/cartsMs/cart/application/findById/cartFindById";
import CartFindByIdQuery from "../../../../../../contexts/cartsMs/cart/application/findById/cartFindByIdQuery";
import CartFindByIdQueryHandler from "../../../../../../contexts/cartsMs/cart/application/findById/cartFindByIdQueryHandler";
import CartFindByIdResponse from "../../../../../../contexts/cartsMs/cart/application/findById/cartFindByIdResponse";
import CartView from "../../../../../../contexts/cartsMs/cart/domain/read/cartView";
import CartNotFoundError from "../../../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartId from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartId";
import CartItems from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartItems";
import CartValidated from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartValidated";
import UserId from "../../../../../../contexts/cartsMs/cart/domain/valueObject/userId";
import InvalidArgumentError from "../../../../../../contexts/shared/domain/invalidArgumentError";
import QueryBus from "../../../../../../contexts/shared/domain/queryBus/queryBus";
import Uuid from "../../../../../../contexts/shared/domain/valueObject/uuid";
import InMemoryQueryBus from "../../../../../../contexts/shared/infrastructure/queryBus/inMemoryQueryBus";
import QueryHandlersMapper from "../../../../../../contexts/shared/infrastructure/queryBus/queryHandlersMapper";
import CartRepositoryMock from "../../__mocks__/cartRepositoryMock";

describe("CartFindById Test Suit", () => {
  let cartRepository: CartRepositoryMock;
  let queryBus: QueryBus;
  beforeAll(() => {
    cartRepository = new CartRepositoryMock();
    const service = new CartFindById(cartRepository);
    const queryHandler = new CartFindByIdQueryHandler(service);
    const queryhandlersMapper = new QueryHandlersMapper([queryHandler]);
    queryBus = new InMemoryQueryBus(queryhandlersMapper);
  });
  it("Should rise on Invalid Cart Id", async () => {
    // Given
    const query = new CartFindByIdQuery("NonUUID");
    // When/Then
    await expect(queryBus.ask(query)).rejects.toThrow(InvalidArgumentError);
  });

  it("Should rise on missing Cart Id", async () => {
    // Given
    cartRepository.whenSearchByIdReturn(null);
    const missingId = Uuid.random().toString();
    const query = new CartFindByIdQuery(missingId);
    // When/Then
    await expect(queryBus.ask(query)).rejects.toThrow(CartNotFoundError);
  });

  it("Should return correct Cart", async () => {
    // Given
    const cartId = CartId.random();
    const userId = UserId.random();
    cartRepository.whenSearchByIdReturn(CartView.create(cartId, userId));
    const query = new CartFindByIdQuery(cartId.toString());
    // When
    const cartResponse: CartFindByIdResponse = await queryBus.ask(query);
    const cart = cartResponse.cart;
    // Then
    expect(cartId.equals(cart.id)).toBeTruthy();
    expect(userId.equals(cart.userId)).toBeTruthy();
    expect(CartValidated.initialize().equals(cart.validated)).toBeTruthy();
    expect(CartItems.initialize().equals(cart.items)).toBeTruthy();
  });
});
