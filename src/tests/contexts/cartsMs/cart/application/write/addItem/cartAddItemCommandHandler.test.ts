import CartCountById from "../../../../../../../contexts/cartsMs/cart/application/read/countById/cartCountById";
import CartCountByIdQueryHandler from "../../../../../../../contexts/cartsMs/cart/application/read/countById/cartCountByIdQueryHandler";
import CartAddItem from "../../../../../../../contexts/cartsMs/cart/application/write/addItem/cartAddItem";
import CartAddItemCommand from "../../../../../../../contexts/cartsMs/cart/application/write/addItem/cartAddItemCommand";
import CartAddItemCommandHandler from "../../../../../../../contexts/cartsMs/cart/application/write/addItem/cartAddItemCommandHandler";
import CartNotFoundError from "../../../../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartCount from "../../../../../../../contexts/cartsMs/cart/domain/valueObject/cartCount";
import Price from "../../../../../../../contexts/cartsMs/cart/domain/valueObject/price";
import Cart from "../../../../../../../contexts/cartsMs/cart/domain/write/cart";
import CartItemAddedDomainEvent from "../../../../../../../contexts/cartsMs/cart/domain/write/cartItemAddedDomainEvent";
import InvalidArgumentError from "../../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../../contexts/shared/domain/valueObject/uuid";
import CommandHandlersMapper from "../../../../../../../contexts/shared/infrastructure/commandBus/commandHandlersMapper";
import InMemoryCommandBus from "../../../../../../../contexts/shared/infrastructure/commandBus/inMemoryCommandBus";
import InMemoryQueryBus from "../../../../../../../contexts/shared/infrastructure/queryBus/inMemoryQueryBus";
import QueryHandlersMapper from "../../../../../../../contexts/shared/infrastructure/queryBus/queryHandlersMapper";
import EventBusMock from "../../../../shared/__mocks__/eventBusMock";
import CartEventStoreMock from "../../../__mocks__/cartEventStoreMock";
import CartViewRepositoryMock from "../../../__mocks__/cartViewRepositoryMock";

describe("CartAddItem Test Suit", () => {
  let cartViewRepository: CartViewRepositoryMock;
  let cartEventStore: CartEventStoreMock;
  let eventBus: EventBusMock;
  let commandBus: InMemoryCommandBus;
  let queryBus: InMemoryQueryBus;
  beforeAll(() => {
    cartViewRepository = new CartViewRepositoryMock();
    const countByIdService = new CartCountById(cartViewRepository);
    const queryHandler = new CartCountByIdQueryHandler(countByIdService);
    const queryMapper = new QueryHandlersMapper([queryHandler]);
    queryBus = new InMemoryQueryBus();
    queryBus.queryHandlersMapper = queryMapper;

    cartEventStore = new CartEventStoreMock();
    eventBus = new EventBusMock();
    const service = new CartAddItem(cartEventStore, eventBus, queryBus);

    const commandHandler = new CartAddItemCommandHandler(service);
    const commandHandlersMapper = new CommandHandlersMapper([commandHandler]);
    commandBus = new InMemoryCommandBus();
    commandBus.commandHandlersMapper = commandHandlersMapper;
  });

  it("Should rise on Invalid Cart Id", async () => {
    // Given
    const command = new CartAddItemCommand(
      "NonUUID",
      Uuid.random().toString(),
      3
    );
    // When/Then
    await expect(commandBus.dispatch(command)).rejects.toThrow(
      InvalidArgumentError
    );
  });

  it("Should rise on Invalid Cart Item Id", async () => {
    // Given
    const command = new CartAddItemCommand(
      Uuid.random().toString(),
      "NonUUID",
      3
    );
    // When/Then
    await expect(commandBus.dispatch(command)).rejects.toThrow(
      InvalidArgumentError
    );
  });

  it("Should rise on Invalid Price value", async () => {
    // Given
    const command = new CartAddItemCommand(
      Uuid.random().toString(),
      Uuid.random().toString(),
      -1
    );
    // When/Then
    await expect(commandBus.dispatch(command)).rejects.toThrow(
      InvalidArgumentError
    );
  });

  it("Should rise on Missing Cart Error", async () => {
    // Given
    const missingCartId = Uuid.random();
    const productId = Uuid.random();
    const price = 0.1;
    cartViewRepository.whenCountByIdReturn(new CartCount(0));
    const command = new CartAddItemCommand(
      missingCartId.toString(),
      productId.toString(),
      price
    );
    // When/Then
    await expect(commandBus.dispatch(command)).rejects.toThrow(
      CartNotFoundError
    );
  });

  it("Should create a new item", async () => {
    // Given
    const cartId = Uuid.random();
    const productId = Uuid.random();
    const price = new Price(0.01);
    const dbCart = Cart.create(cartId, Uuid.random());
    dbCart.pullDomainEvents(); // Remove pull events to empty the list
    cartViewRepository.whenCountByIdReturn(new CartCount(1));
    cartEventStore.whenLoadReturn(dbCart);
    const command = new CartAddItemCommand(
      cartId.toString(),
      productId.toString(),
      price.value
    );
    // When
    await commandBus.dispatch(command);
    const lastSavedEvents = cartEventStore.lastSavedEvents();
    // Then
    const expectedEventPrimitive = {
      id: cartId.toString(),
      version: 1,
      price: price.value,
      productId: productId.toString(),
    };
    expect(lastSavedEvents).toHaveLength(1);
    expect(lastSavedEvents[0]).toBeInstanceOf(CartItemAddedDomainEvent);
    expect(lastSavedEvents[0].toPrimitive()).toEqual(expectedEventPrimitive);

    const lastPublishedEvents = eventBus.lastPublishedEvents();
    expect(lastPublishedEvents).toHaveLength(1);
    const itemAddedEvent = lastPublishedEvents[0];
    expect(itemAddedEvent.toPrimitive()).toEqual(expectedEventPrimitive);
  });

  it("Should update an already created item", async () => {
    // Given
    const cartId = Uuid.random();
    const productId = Uuid.random();
    const price = new Price(0.01);
    const dbCart = Cart.create(cartId, Uuid.random());
    dbCart.addItem(productId, price);
    dbCart.pullDomainEvents();
    cartViewRepository.whenCountByIdReturn(new CartCount(1));
    cartEventStore.whenLoadReturn(dbCart);
    const command = new CartAddItemCommand(
      cartId.toString(),
      productId.toString(),
      price.value
    );
    // When
    await commandBus.dispatch(command);
    const lastSavedEvents = cartEventStore.lastSavedEvents();
    // Then
    const expectedEventPrimitive = {
      id: cartId.toString(),
      version: 2,
      price: price.value,
      productId: productId.toString(),
    };
    expect(lastSavedEvents).toHaveLength(1);
    expect(lastSavedEvents[0]).toBeInstanceOf(CartItemAddedDomainEvent);
    expect(lastSavedEvents[0].toPrimitive()).toEqual(expectedEventPrimitive);

    const lastPublishedEvents = eventBus.lastPublishedEvents();
    expect(lastPublishedEvents).toHaveLength(1);
    const itemAddedEvent = lastPublishedEvents[0];
    expect(itemAddedEvent.toPrimitive()).toEqual(expectedEventPrimitive);
  });
});
