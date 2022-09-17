import container from "./dependencyInjection";
import Server from "./server";

export class MailerBackendApp {
  private server?: Server;

  async start() {
    const port = process.env.PORT || "3001";
    this.server = new Server(port);
    await this.registerSubscribers();
    return this.server.listen();
  }

  async stop() {
    await this.server?.stop();
  }

  get port(): string {
    if (!this.server) {
      throw new Error("Mailer backend application has not been started");
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
}
