import RabbitMqConfig from "../../../shared/infrastructure/eventBus/rabbitMQ/rabbitMqConfig";

export default class RabbitMqConfigFactory {
  static createConfig(): RabbitMqConfig {
    return {
      exchange: "DomainEvents",
      host: "localhost",
      user: "guest",
      password: "guest",
    };
  }
}
