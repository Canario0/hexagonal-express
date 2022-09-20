import CommandNotRegisteredError from "../../../../../../contexts/shared/domain/commandBus/commandNotRegisteredError";
import CommandHandlersMapper from "../../../../../../contexts/shared/infrastructure/commandBus/commandHandlersMapper";
import InMemoryCommandBus from "../../../../../../contexts/shared/infrastructure/commandBus/inMemoryCommandBus";
import { CommandHandlerDummy } from "./__mocks__/commandHandlerDummy";
import DummyCommand from "./__mocks__/dummyCommand";
import UnhandledCommand from "./__mocks__/unhandledCommand";

describe("InMemoryCommandBus", () => {
  it("throws an error if dispatches a command without handler", async () => {
    // Given
    const unhandledCommand = new UnhandledCommand();
    const commandHandlersMapper = new CommandHandlersMapper([]);
    const commandBus = new InMemoryCommandBus();
    commandBus.commandHandlersMapper = commandHandlersMapper;
    // When/Then
    await expect(commandBus.dispatch(unhandledCommand)).rejects.toBeInstanceOf(
      CommandNotRegisteredError
    );
  });

  it("accepts a command with handler", async () => {
    // Given
    const dummyCommand = new DummyCommand();
    const commandHandlerDummy = new CommandHandlerDummy();
    const commandHandlersMapper = new CommandHandlersMapper([
      commandHandlerDummy,
    ]);
    const commandBus = new InMemoryCommandBus();
    commandBus.commandHandlersMapper = commandHandlersMapper;
    // When
    await commandBus.dispatch(dummyCommand);
    // Then
    expect(commandHandlerDummy.commandHandlerMock).toBeCalledTimes(1);
  });
});
