import Command from "../../../../shared/domain/commandBus/command";
import CommandHandler from "../../../../shared/domain/commandBus/commandHandler";
import CartCreate from "./cartCreate";
import CartCreateCommand from "./cartCreateCommand";

export default class CartCreateCommandHandler
  implements CommandHandler<CartCreateCommand>
{
  public constructor(private cartCreate: CartCreate) {}

  public subscribedTo(): Command {
    return CartCreateCommand;
  }

  public async handle(command: CartCreateCommand) {
    await this.cartCreate.run(command.id, command.userId);
  }
}
