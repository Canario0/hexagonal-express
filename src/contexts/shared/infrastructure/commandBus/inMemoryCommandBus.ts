import Command from "../../domain/commandBus/command";
import CommandBus from "../../domain/commandBus/commandBus";
import CommandHandlersMapper from "./commandHandlersMapper";

export default class InMemoryCommandBus implements CommandBus {
  private _commandHandlersMapper: CommandHandlersMapper;

  constructor() {
    this._commandHandlersMapper = new CommandHandlersMapper([]);
  }

  public set commandHandlersMapper(
    commandHandlersMapper: CommandHandlersMapper
  ) {
    this._commandHandlersMapper = commandHandlersMapper;
  }

  async dispatch(command: Command): Promise<void> {
    const handler = this._commandHandlersMapper.search(command);
    await handler.handle(command);
  }
}
