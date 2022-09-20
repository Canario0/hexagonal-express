import Command from "../../../../../shared/domain/commandBus/command";

export default class CartCreateCommand extends Command {
  public readonly id: string;
  public readonly userId: string;

  constructor(id: string, userId: string) {
    super();
    this.id = id;
    this.userId = userId;
  }
}
