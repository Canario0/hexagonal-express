import Command from "../../domain/commandBus/command";
import CommandBus from "../../domain/commandBus/commandBus";
import CommandHandlersMapper from "./commandHandlersMapper";

export default class InMemoryCommandBus implements CommandBus {
  constructor(private commandHandlersMapper: CommandHandlersMapper) {}

  async dispatch(command: Command): Promise<void> {
    const handler = this.commandHandlersMapper.search(command);
    await handler.handle(command);
  }
}
