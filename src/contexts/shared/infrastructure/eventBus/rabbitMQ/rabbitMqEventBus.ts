import { Message } from "amqp-ts";
import EventBus from "../../../domain/eventBus/eventBus";
import DomainEvent from "../../../domain/eventBus/domainEvent";
import DomainEventJSONSerializer from "../domainEventJSONSerializer";
import Logger from "../../../domain/logger";
import RabbitMqConnection from "./rabbitMqConnection";
import RabbitMqConfig from "./rabbitMqConfig";

export default class RabbitMqEventbus implements EventBus {
  private connection: RabbitMqConnection;
  private logger: Logger;
  private serializer: DomainEventJSONSerializer;
  private config: RabbitMqConfig;

  constructor(
    logger: Logger,
    config: RabbitMqConfig,
    connection: RabbitMqConnection,
    serializer: DomainEventJSONSerializer
  ) {
    this.logger = logger;
    this.config = config;
    this.connection = connection;
    this.serializer = serializer;
  }

  async publish(events: Array<DomainEvent>): Promise<void> {
    const executions: any = [];
    events.map((event) => {
      const message = new Message(this.serializer.serialize(event));
      this.logger.info(
        `[RabbitMqEventBus] Event to be published: ${event.eventName}`
      );
      executions.push(
        this.connection
          .exchange(this.config.exchange)
          .send(message, event.eventName)
      );
    });
    await Promise.all(executions);
  }
}
