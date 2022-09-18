import Command from "../../../../shared/domain/commandBus/command";
import CommandHandler from "../../../../shared/domain/commandBus/commandHandler";
import CartItemCreate from "./cartItemCreate";
import CartItemCreateCommand from "./cartItemCreateCommand";

export default class CartItemCreateCommandHandler
  implements CommandHandler<CartItemCreateCommand>
{
  public constructor(private cartItemCreate: CartItemCreate) {}

  public subscribedTo(): Command {
    return CartItemCreateCommand;
  }

  public async handle(command: CartItemCreateCommand) {
    await this.cartItemCreate.run(command.cartId, command.id, command.price);
  }
}
