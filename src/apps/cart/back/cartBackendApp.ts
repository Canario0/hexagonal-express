import { Definition } from "node-dependency-injection";
import CommandHandlersMapper from "../../../contexts/shared/infrastructure/commandBus/commandHandlersMapper";
import InMemoryCommandBus from "../../../contexts/shared/infrastructure/commandBus/inMemoryCommandBus";
import InMemoryQueryBus from "../../../contexts/shared/infrastructure/queryBus/inMemoryQueryBus";
import QueryHandlersMapper from "../../../contexts/shared/infrastructure/queryBus/queryHandlersMapper";
import container from "./dependencyInjection";
import Server from "./server";

export class CartBackendApp {
  private server?: Server;

  async start() {
    const port = process.env.PORT || "3002";
    this.server = new Server(port);
    await this.registerSubscribers();
    this.registerQueryHandlers();
    this.registerCommandHandlers();
    return this.server.listen();
  }

  async stop() {
    await this.server?.stop();
  }

  get port(): string {
    if (!this.server) {
      throw new Error("Cart backend application has not been started");
    }
    return this.server.port;
  }

  get httpServer() {
    return this.server?.httpServer;
  }

  private async registerSubscribers() {
    const eventConsumer = container.get("Shared.EventConsumers");
    await eventConsumer.start();
  }

  private registerQueryHandlers() {
    const queryHandlersDefinition = container.findTaggedServiceIds(
      "queryHandler"
    ) as Map<string, Definition>;
    const queryMapper = new QueryHandlersMapper(
      Array.from(queryHandlersDefinition.keys()).map((key) =>
        container.get(key)
      )
    );
    const queryBus = container.get<InMemoryQueryBus>("Shared.QueryBus");
    queryBus.queryHandlersMapper = queryMapper;
  }

  private registerCommandHandlers() {
    const commandHandlersDefinition = container.findTaggedServiceIds(
      "commandHandler"
    ) as Map<string, Definition>;
    const commandMapper = new CommandHandlersMapper(
      Array.from(commandHandlersDefinition.keys()).map((key) =>
        container.get(key)
      )
    );
    const commandBus = container.get<InMemoryCommandBus>("Shared.CommandBus");
    commandBus.commandHandlersMapper = commandMapper;
  }
}
