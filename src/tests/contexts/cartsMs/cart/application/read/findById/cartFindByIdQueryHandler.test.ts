import CartViewFindById from "../../../../../../../contexts/cartsMs/cart/application/read/findById/cartFindById";
import CartFindByIdQuery from "../../../../../../../contexts/cartsMs/cart/application/read/findById/cartFindByIdQuery";
import CartFindByIdQueryHandler from "../../../../../../../contexts/cartsMs/cart/application/read/findById/cartFindByIdQueryHandler";
import CartFindByIdResponse from "../../../../../../../contexts/cartsMs/cart/application/read/findById/cartFindByIdResponse";
import CartNotFoundError from "../../../../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartItemsView from "../../../../../../../contexts/cartsMs/cart/domain/read/cartItemsView";
import CartView from "../../../../../../../contexts/cartsMs/cart/domain/read/cartView";
import CartId from "../../../../../../../contexts/cartsMs/cart/domain/valueObject/cartId";
import CartValidated from "../../../../../../../contexts/cartsMs/cart/domain/valueObject/cartValidated";
import UserId from "../../../../../../../contexts/cartsMs/cart/domain/valueObject/userId";
import InvalidArgumentError from "../../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../../contexts/shared/domain/valueObject/uuid";
import InMemoryQueryBus from "../../../../../../../contexts/shared/infrastructure/queryBus/inMemoryQueryBus";
import QueryHandlersMapper from "../../../../../../../contexts/shared/infrastructure/queryBus/queryHandlersMapper";
import CartViewRepositoryMock from "../../../__mocks__/cartViewRepositoryMock";

describe("CartFindById Test Suit", () => {
  let cartViewRepository: CartViewRepositoryMock;
  let queryBus: InMemoryQueryBus;
  beforeAll(() => {
    cartViewRepository = new CartViewRepositoryMock();
    const service = new CartViewFindById(cartViewRepository);
    const queryHandler = new CartFindByIdQueryHandler(service);
    const queryhandlersMapper = new QueryHandlersMapper([queryHandler]);
    queryBus = new InMemoryQueryBus();
    queryBus.queryHandlersMapper = queryhandlersMapper;
  });
  it("Should rise on Invalid Cart Id", async () => {
    // Given
    const query = new CartFindByIdQuery("NonUUID");
    // When/Then
    await expect(queryBus.ask(query)).rejects.toThrow(InvalidArgumentError);
  });

  it("Should rise on missing Cart Id", async () => {
    // Given
    cartViewRepository.whenSearchByIdReturn(null);
    const missingId = Uuid.random().toString();
    const query = new CartFindByIdQuery(missingId);
    // When/Then
    await expect(queryBus.ask(query)).rejects.toThrow(CartNotFoundError);
  });

  it("Should return correct Cart", async () => {
    // Given
    const cartId = CartId.random();
    const userId = UserId.random();
    cartViewRepository.whenSearchByIdReturn(CartView.create(cartId, userId));
    const query = new CartFindByIdQuery(cartId.toString());
    // When
    const cartResponse: CartFindByIdResponse = await queryBus.ask(query);
    const cart = cartResponse.cart;
    // Then
    expect(cartId.equals(cart.id)).toBeTruthy();
    expect(userId.equals(cart.userId)).toBeTruthy();
    expect(CartValidated.initialize().equals(cart.validated)).toBeTruthy();
    expect(CartItemsView.initialize().equals(cart.items)).toBeTruthy();
  });
});
