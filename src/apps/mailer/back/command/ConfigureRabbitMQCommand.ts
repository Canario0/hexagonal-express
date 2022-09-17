import * as DomainEventSubscribers from "../../../../contexts/shared/infrastructure/eventBus/domainEventSubscribers";
import RabbitMqConfig from "../../../../contexts/shared/infrastructure/eventBus/rabbitMQ/rabbitMqConfig";
import RabbitMqConfigurer from "../../../../contexts/shared/infrastructure/eventBus/rabbitMQ/rabbitMqConfigurer";
import RabbitMqConnection from "../../../../contexts/shared/infrastructure/eventBus/rabbitMQ/rabbitMqConnection";
import container from "../dependencyInjection";

export class ConfigureRabbitMQCommand {
  static async run() {
    const connection = container.get<RabbitMqConnection>(
      "Shared.RabbitMqConnection"
    );
    const { exchange } = container.get<RabbitMqConfig>("Shared.RabbitMqConfig");
    const configurer = container.get<RabbitMqConfigurer>(
      "Shared.RabbitMQConfigurer"
    );
    const subscribers = DomainEventSubscribers.from(container);
    await configurer.configure(exchange, subscribers);
    await connection.close();
  }
}
