import CartNotFoundError from "../../../../../../contexts/cartsMs/cart/domain/cartNotFoundError";
import CartCount from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartCount";
import CartItemCreate from "../../../../../../contexts/cartsMs/cartItem/application/create/cartItemCreate";
import CartItemCreateCommand from "../../../../../../contexts/cartsMs/cartItem/application/create/cartItemCreateCommand";
import CartItemCreateCommandHandler from "../../../../../../contexts/cartsMs/cartItem/application/create/cartItemCreateCommandHandler";
import CartItemView from "../../../../../../contexts/cartsMs/cart/domain/read/cartItemView";
import CartItemCount from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartItemCount";
import CommandBus from "../../../../../../contexts/shared/domain/commandBus/commandBus";
import InvalidArgumentError from "../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../contexts/shared/domain/valueObject/uuid";
import CommandHandlersMapper from "../../../../../../contexts/shared/infrastructure/commandBus/commandHandlersMapper";
import InMemoryCommandBus from "../../../../../../contexts/shared/infrastructure/commandBus/inMemoryCommandBus";
import CartRepositoryMock from "../../../cart/__mocks__/cartRepositoryMock";
import EventBusMock from "../../../shared/__mocks__/eventBusMock";
import CartItemRepositoryMock from "../../__mocks__/cartItemRepositoryMock";
import Price from "../../../../../../contexts/cartsMs/cart/domain/valueObject/price";

describe("CartItemCreate Test Suit", () => {
  let cartRepository: CartRepositoryMock;
  let cartItemRepository: CartItemRepositoryMock;
  let eventBus: EventBusMock;
  let commandBus: CommandBus;
  beforeAll(() => {
    cartRepository = new CartRepositoryMock();
    cartItemRepository = new CartItemRepositoryMock();
    eventBus = new EventBusMock();
    const service = new CartItemCreate(
      cartItemRepository,
      cartRepository,
      eventBus
    );
    const commandHandler = new CartItemCreateCommandHandler(service);
    const commandHandlersMapper = new CommandHandlersMapper([commandHandler]);
    commandBus = new InMemoryCommandBus(commandHandlersMapper);
  });

  it("Should rise on Invalid Cart Id", async () => {
    // Given
    const command = new CartItemCreateCommand(
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
    const command = new CartItemCreateCommand(
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
    const command = new CartItemCreateCommand(
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
    const itemId = Uuid.random();
    const price = 0.1;
    cartRepository.whenCountByIdReturn(new CartCount(0));
    const command = new CartItemCreateCommand(
      missingCartId.toString(),
      itemId.toString(),
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
    const itemId = Uuid.random();
    const price = new Price(0.01);
    cartRepository.whenCountByIdReturn(new CartCount(1));
    cartItemRepository.whenFindByIdReturn(null);
    const command = new CartItemCreateCommand(
      cartId.toString(),
      itemId.toString(),
      price.value
    );
    // When
    await commandBus.dispatch(command);
    const lastSavedCartItem = cartItemRepository.lastSavedCartItem();
    // Then
    expect(lastSavedCartItem).toBeInstanceOf(CartItemView);
    expect(lastSavedCartItem.toPrimitives()).toEqual(
      CartItemView.create(itemId, price, cartId).toPrimitives()
    );
    const lastPublishedEvents = eventBus.lastPublishedEvents();
    expect(lastPublishedEvents).toHaveLength(1);
    const itemAddedEvent = lastPublishedEvents[0];
    expect(itemAddedEvent.toPrimitive()).toEqual({
      id: expect.anything(),
      price: price.value,
      cartId: cartId.toString(),
    });
  });

  it("Should update an already created item", async () => {
    // Given
    const cartId = Uuid.random();
    const itemId = Uuid.random();
    const price = new Price(0.01);
    const dbItem = new CartItemView(
      itemId,
      price,
      CartItemCount.initialize(),
      cartId
    );
    cartRepository.whenCountByIdReturn(new CartCount(1));
    cartItemRepository.whenFindByIdReturn(dbItem);
    const command = new CartItemCreateCommand(
      cartId.toString(),
      itemId.toString(),
      price.value
    );
    // When
    await commandBus.dispatch(command);
    const lastSavedCartItem = cartItemRepository.lastSavedCartItem();
    // Then
    expect(lastSavedCartItem).toBeInstanceOf(CartItemView);
    expect(lastSavedCartItem.toPrimitives()).toEqual(
      new CartItemView(itemId, price, new CartItemCount(2), cartId).toPrimitives()
    );
    const lastPublishedEvents = eventBus.lastPublishedEvents();
    expect(lastPublishedEvents).toHaveLength(1);
    const itemAddedEvent = lastPublishedEvents[0];
    expect(itemAddedEvent.toPrimitive()).toEqual({
      id: itemId.toString(),
      price: price.value,
      cartId: cartId.toString(),
    });
  });
});
