import { DataSource, ObjectType, Repository } from "typeorm";

export default abstract class TypeORMRepositry<E extends Object> {
  constructor(private client: Promise<DataSource>) {}

  protected abstract entity(): ObjectType<E>;

  protected async getRepository(): Promise<Repository<E>> {
    return (await this.client).getRepository(this.entity());
  }

  protected async persist(entity: object): Promise<void> {
    const repository = await this.getRepository();
    await repository.upsert(entity, {
      conflictPaths: ["id"],
      skipUpdateIfNoValuesChanged: true,
    });
  }
}
