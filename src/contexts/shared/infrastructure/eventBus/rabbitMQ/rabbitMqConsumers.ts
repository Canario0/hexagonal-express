import Logger from "../../../domain/logger";
import DomainEvent from "../../../domain/eventBus/domainEvent";
import DomainEventSubscriber from "../../../domain/eventBus/domainEventSubscriber";
import DomainEventJsonDeserializer from "../domainEventJSONDeserializer";
import RabbitMqConnection from "./rabbitMqConnection";
import { Message } from "amqp-ts";

export default class RabbitMqConsumer {
  private logger: Logger;
  private connection: RabbitMqConnection;
  private subscribers: DomainEventSubscriber<DomainEvent>[];
  private deserializer: DomainEventJsonDeserializer;

  public constructor(
    logger: Logger,
    connection: RabbitMqConnection,
    deserializer: DomainEventJsonDeserializer,
    subscribers: DomainEventSubscriber<DomainEvent>[]
  ) {
    this.logger = logger;
    this.connection = connection;
    this.deserializer = deserializer;
    this.subscribers = subscribers;
  }

  public async start(): Promise<void> {
    await Promise.all(
      this.subscribers.map(async (subscriber) => {
        const queue = this.connection.queue(subscriber.subscriberName());
        await queue.activateConsumer(this.consume(subscriber), {
          noAck: false,
          exclusive: true,
        });
        return queue;
      })
    );
  }

  public async stopConsumers() {
    await Promise.all(
      this.connection.getAllQueues().map((queue) => queue.stopConsumer())
    );
  }

  private consume(
    subscriber: DomainEventSubscriber<DomainEvent>
  ): (message: Message) => Promise<void> {
    return async (message) => {
      const event = this.deserializer.deserialize(message.content.toString());
      if (event) {
        this.logger.info(
          `[RabbitMqEventBus] Message processed: ${event.eventName} by ${subscriber.constructor.name}`
        );
        await subscriber.on(event);
      }
      message.ack();
    };
  }
}
