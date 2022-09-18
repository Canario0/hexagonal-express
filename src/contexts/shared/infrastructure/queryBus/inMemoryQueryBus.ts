import Query from "../../domain/queryBus/query";
import Response from "../../domain/queryBus/response";
import QueryBus from "./../../domain/queryBus/queryBus";
import QueryHandlersMapper from "./queryHandlersMapper";

export default class InMemoryQueryBus implements QueryBus {
  constructor(private queryHandlersInformation: QueryHandlersMapper) {}

  async ask<R extends Response>(query: Query): Promise<R> {
    const handler = this.queryHandlersInformation.search(query);

    return handler.handle(query) as Promise<R>;
  }
}
