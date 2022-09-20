import CartCountById from "../../../../../../../contexts/cartsMs/cart/application/read/countById/cartCountById";
import CartCountByIdQueryHandler from "../../../../../../../contexts/cartsMs/cart/application/read/countById/cartCountByIdQueryHandler";
import CartCreate from "../../../../../../../contexts/cartsMs/cart/application/write/create/cartCreate";
import CartCreateCommand from "../../../../../../../contexts/cartsMs/cart/application/write/create/cartCreateCommand";
import CartCreateCommandHandler from "../../../../../../../contexts/cartsMs/cart/application/write/create/cartCreateCommandHandler";
import CartAlreadyExists from "../../../../../../../contexts/cartsMs/cart/domain/cartAlreadyExists";
import CartCount from "../../../../../../../contexts/cartsMs/cart/domain/valueObject/cartCount";
import CartCreatedDomainEvent from "../../../../../../../contexts/cartsMs/cart/domain/write/cartCreatedDomainEvent";
import InvalidArgumentError from "../../../../../../../contexts/shared/domain/invalidArgumentError";
import Uuid from "../../../../../../../contexts/shared/domain/valueObject/uuid";
import CommandHandlersMapper from "../../../../../../../contexts/shared/infrastructure/commandBus/commandHandlersMapper";
import InMemoryCommandBus from "../../../../../../../contexts/shared/infrastructure/commandBus/inMemoryCommandBus";
import InMemoryQueryBus from "../../../../../../../contexts/shared/infrastructure/queryBus/inMemoryQueryBus";
import QueryHandlersMapper from "../../../../../../../contexts/shared/infrastructure/queryBus/queryHandlersMapper";
import EventBusMock from "../../../../shared/__mocks__/eventBusMock";
import CartEventStoreMock from "../../../__mocks__/cartEventStoreMock";
import CartViewRepositoryMock from "../../../__mocks__/cartViewRepositoryMock";

describe("CartCreateCommandHandler Test Suit", () => {
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

    cartEventStore = new CartEventStoreMock();
    eventBus = new EventBusMock();
    queryBus = new InMemoryQueryBus();
    queryBus.queryHandlersMapper = queryMapper;
    const service = new CartCreate(cartEventStore, eventBus, queryBus);

    const commandHandler = new CartCreateCommandHandler(service);
    const commandHandlersMapper = new CommandHandlersMapper([commandHandler]);
    commandBus = new InMemoryCommandBus();
    commandBus.commandHandlersMapper = commandHandlersMapper;
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
    cartViewRepository.whenCountByIdReturn(new CartCount(1));
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
    cartViewRepository.whenCountByIdReturn(new CartCount(0));
    const command = new CartCreateCommand(cartId.toString(), userId.toString());
    // When
    await commandBus.dispatch(command);
    const lastSavedEvents = cartEventStore.lastSavedEvents();
    // Then
    expect(lastSavedEvents).toHaveLength(1);
    expect(lastSavedEvents[0]).toBeInstanceOf(CartCreatedDomainEvent);
    expect(lastSavedEvents[0].toPrimitive()).toEqual({
      id: cartId.toString(),
      version: 0,
      userId: userId.toString(),
      validated: false,
    });
    const publishedEvents = eventBus.lastPublishedEvents();
    expect(publishedEvents).toHaveLength(1);
    expect(publishedEvents[0]).toEqual(lastSavedEvents[0]);
  });
});
