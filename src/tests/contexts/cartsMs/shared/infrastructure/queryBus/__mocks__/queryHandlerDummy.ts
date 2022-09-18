import QueryHandler from "../../../../../../../contexts/shared/domain/queryBus/queryHandler";
import DummyQuery from "./dummyQuery";
import DummyQueryResponse from "./dummyQueryResponse";

export class QueryHandlerDummy
  implements QueryHandler<DummyQuery, DummyQueryResponse>
{
  public readonly queryHandlerMock = jest.fn();
  subscribedTo(): DummyQuery {
    return DummyQuery;
  }

  async handle(command: DummyQuery): Promise<DummyQueryResponse> {
    return this.queryHandlerMock(command);
  }
}
