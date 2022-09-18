import CartCreate from "../../../../../../contexts/cartsMs/cart/application/create/cartCreate";
import CartCreateCommand from "../../../../../../contexts/cartsMs/cart/application/create/cartCreateCommand";
import CartCreateCommandHandler from "../../../../../../contexts/cartsMs/cart/application/create/cartCreateCommandHandler";
import Cart from "../../../../../../contexts/cartsMs/cart/domain/cart";
import CartAlreadyExists from "../../../../../../contexts/cartsMs/cart/domain/cartAlreadyExists";
import CartCreatedDomainEvent from "../../../../../../contexts/cartsMs/cart/domain/cartCreatedDomainEvent";
import CartCount from "../../../../../../contexts/cartsMs/cart/domain/valueObject/cartCount";
import CommandBus from "../../../../../../contexts/shared/domain/commandBus/commandBus";
import InvalidArgumentError from "../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../contexts/shared/domain/valueObject/uuid";
import CommandHandlersMapper from "../../../../../../contexts/shared/infrastructure/commandBus/commandHandlersMapper";
import InMemoryCommandBus from "../../../../../../contexts/shared/infrastructure/commandBus/inMemoryCommandBus";
import EventBusMock from "../../../shared/__mocks__/eventBusMock";
import CartRepositoryMock from "../../__mocks__/cartRepositoryMock";

describe("CartCreate Test Suit", () => {
  let cartRepository: CartRepositoryMock;
  let eventBus: EventBusMock;
  let commandBus: CommandBus;
  beforeAll(() => {
    cartRepository = new CartRepositoryMock();
    eventBus = new EventBusMock();
    const service = new CartCreate(cartRepository, eventBus);
    const commandHandler = new CartCreateCommandHandler(service);
    const commandHandlersMapper = new CommandHandlersMapper([commandHandler]);
    commandBus = new InMemoryCommandBus(commandHandlersMapper);
  });
  it("Should rise on Invalid Cart Id", async () => {
    // Given
    const command = new CartCreateCommand("NonUUID", Uuid.random().toString());
    // When/Then
    await expect(commandBus.dispatch(command)).rejects.toThrow(
      InvalidArgumentError
    );
  });

  it("Should rise on cart already exists.", async () => {
    // Given
    const cartIdInUse = Uuid.random().toString();
    const userId = Uuid.random().toString();
    cartRepository.whenCountByIdReturn(new CartCount(1));
    const command = new CartCreateCommand(cartIdInUse, userId);
    // When/Then
    await expect(commandBus.dispatch(command)).rejects.toThrow(
      CartAlreadyExists
    );
  });

  it("Should create Cart", async () => {
    // Given
    const cartId = Uuid.random();
    const userId = Uuid.random();
    cartRepository.whenCountByIdReturn(new CartCount(0));
    const command = new CartCreateCommand(cartId.toString(), userId.toString());
    // When
    await commandBus.dispatch(command);
    const lastSavedCart = cartRepository.lastSavedCart();
    // Then
    expect(lastSavedCart).toBeInstanceOf(Cart);
    expect(lastSavedCart.toPrimitives()).toEqual(
      Cart.create(cartId, userId).toPrimitives()
    );
    const publishedEvents = eventBus.lastPublishedEvents();
    expect(publishedEvents).toHaveLength(1);
    const createEvent = publishedEvents[0] as CartCreatedDomainEvent;
    expect(createEvent.aggregateId).toEqual(cartId.toString());
    expect(createEvent.userId).toEqual(userId.toString());
    expect(createEvent.validated).toBeFalsy();
  });
});
