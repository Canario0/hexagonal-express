import Query from "../../domain/queryBus/query";
import Response from "../../domain/queryBus/response";
import QueryBus from "./../../domain/queryBus/queryBus";
import QueryHandlersMapper from "./queryHandlersMapper";

export default class InMemoryQueryBus implements QueryBus {
  private _queryHandlersMapper: QueryHandlersMapper;

  constructor() {
    this._queryHandlersMapper = new QueryHandlersMapper([]);
  }

  set queryHandlersMapper(queryHandlersMapper: QueryHandlersMapper) {
    this._queryHandlersMapper = queryHandlersMapper;
  }

  async ask<R extends Response>(query: Query): Promise<R> {
    const handler = this._queryHandlersMapper.search(query);

    return handler.handle(query) as Promise<R>;
  }
}
