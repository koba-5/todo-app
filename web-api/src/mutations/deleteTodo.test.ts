import setupJest from '../framework/jest/setupJest';

const { server } = setupJest();

describe('Mutation deleteTodo', () => {
  test('The case to delete the todo', async () => {
    /* given */
    const expected = { deleteTodo: 100000 };

    /* when */
    const actual = await server.executeOperation({
      query: 'mutation deleteTodo($input: DeleteTodoInput!) { deleteTodo(input: $input) }',
      variables: { input: { id: 100000 } },
    });

    /* then */
    expect(actual.data).toMatchObject(expected);
  });
});
