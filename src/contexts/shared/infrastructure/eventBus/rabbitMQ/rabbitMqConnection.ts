import { Exchange, Connection, Queue } from "amqp-ts";
import RabbitMqConfig from "./rabbitMqConfig";

export default class RabbitMqConnection {
  private connection?: Connection;
  private exchanges: Map<string, Exchange>;
  private config: RabbitMqConfig;
  private queues: Map<string, Queue>;

  public constructor(config: RabbitMqConfig) {
    this.config = config;
    this.exchanges = new Map();
    this.queues = new Map();
  }

  public getAllQueues() {
    return Array.from(this.queues.values());
  }

  public queue(name: string, options?: any): Queue {
    let queue = this.queues.get(name);
    if (queue == null) {
      queue = this.getConnection().declareQueue(name, options);
      this.queues.set(name, queue);
    }
    return queue;
  }

  public exchange(name: string): Exchange {
    let exchange = this.exchanges.get(name);
    if (exchange == null) {
      exchange = this.getConnection().declareExchange(name, "topic", {
        durable: true,
      });
      this.exchanges.set(name, exchange);
    }
    return exchange;
  }

  public async close() {
    await this.getConnection().close();
  }

  private getConnection() {
    if (this.connection == null) {
      this.connection = new Connection(
        `amqp://${this.config.user}:${this.config.password}@${this.config.host}`
      );
    }
    return this.connection;
  }
}
