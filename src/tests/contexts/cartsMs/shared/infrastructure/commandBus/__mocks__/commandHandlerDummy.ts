import CommandHandler from "../../../../../../../contexts/shared/domain/commandBus/commandHandler";
import DummyCommand from "./dummyCommand";

export class CommandHandlerDummy implements CommandHandler<DummyCommand> {
  public readonly commandHandlerMock = jest.fn();
  subscribedTo(): DummyCommand {
    return DummyCommand;
  }

  async handle(command: DummyCommand): Promise<void> {
    this.commandHandlerMock(command);
  }
}
