import { DataSource, DataSourceOptions } from "typeorm";

export default class TypeORMClientFactory {
  private static client: DataSource;

  static async createClient(config: DataSourceOptions): Promise<DataSource> {
    let client = TypeORMClientFactory.getClient();
    if (client == null) {
      client = await TypeORMClientFactory.createAndConnectClient(config);
      TypeORMClientFactory.registerClient(client);
    }
    return client;
  }

  private static getClient(): DataSource {
    return TypeORMClientFactory.client;
  }

  private static async createAndConnectClient(
    config: DataSourceOptions
  ): Promise<DataSource> {
    const client = new DataSource({ ...config });

    await client.initialize();

    return client;
  }

  private static registerClient(client: DataSource): void {
    TypeORMClientFactory.client = client;
  }
}
