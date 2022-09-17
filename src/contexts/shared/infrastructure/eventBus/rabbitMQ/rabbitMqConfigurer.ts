import { Exchange } from "amqp-ts";
import DomainEvent from "../../../domain/eventBus/domainEvent";
import DomainEventSubscriber from "../../../domain/eventBus/domainEventSubscriber";
import RabbitMqConnection from "./rabbitMqConnection";

export default class RabbitMqConfigurer {
  constructor(private connection: RabbitMqConnection) {}

  public async configure(
    exchangeName: string,
    subscribers: DomainEventSubscriber<DomainEvent>[]
  ): Promise<void> {
    const exchange = this.connection.exchange(exchangeName);
    for (const subscriber of subscribers) {
      await this.addQueue(subscriber, exchange!);
    }
  }

  private async addQueue(
    subscriber: DomainEventSubscriber<DomainEvent>,
    exchange: Exchange
  ): Promise<void> {
    const routingKeys = this.routingKeysExtractor(subscriber);
    const queue = this.connection.queue(subscriber.subscriberName(), {
      durable: true,
    });
    for (const routingKey of routingKeys) {
      await queue.bind(exchange, routingKey);
    }
  }

  private routingKeysExtractor(subscriber: DomainEventSubscriber<DomainEvent>) {
    const routingKeys = subscriber
      .subscribedTo()
      .map((event) => event.EVENT_NAME);
    return routingKeys;
  }
}
