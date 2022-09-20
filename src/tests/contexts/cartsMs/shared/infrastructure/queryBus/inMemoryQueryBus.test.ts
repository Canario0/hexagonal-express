import QueryNotRegisteredError from "../../../../../../contexts/shared/domain/queryBus/queryNotRegisteredError";
import InMemoryQueryBus from "../../../../../../contexts/shared/infrastructure/queryBus/inMemoryQueryBus";
import QueryHandlersMapper from "../../../../../../contexts/shared/infrastructure/queryBus/queryHandlersMapper";
import DummyQuery from "./__mocks__/dummyQuery";
import DummyQueryResponse from "./__mocks__/dummyQueryResponse";
import { QueryHandlerDummy } from "./__mocks__/queryHandlerDummy";
import UnhandledQuery from "./__mocks__/unhandledQuery";

describe("InMemoryQueryBus", () => {
  it("throws an error if ask a query without handler", async () => {
    // Given
    const unhandledQuery = new UnhandledQuery();
    const queryHandlersMapper = new QueryHandlersMapper([]);
    const queryBus = new InMemoryQueryBus();
    queryBus.queryHandlersMapper = queryHandlersMapper;
    // When/Then
    await expect(queryBus.ask(unhandledQuery)).rejects.toBeInstanceOf(
      QueryNotRegisteredError
    );
  });

  it("accepts a query with handler", async () => {
    // Given
    const dummyQuery = new DummyQuery();
    const queryHandlerDummy = new QueryHandlerDummy();
    const expectedResponse = new DummyQueryResponse();
    queryHandlerDummy.queryHandlerMock.mockResolvedValue(expectedResponse);
    const queryHandlersMapper = new QueryHandlersMapper([queryHandlerDummy]);
    const queryBus = new InMemoryQueryBus();
    queryBus.queryHandlersMapper = queryHandlersMapper;
    // When
    const response = await queryBus.ask(dummyQuery);
    // Then
    expect(response).toEqual(expectedResponse);
    expect(queryHandlerDummy.queryHandlerMock).toBeCalledTimes(1);
  });
});
