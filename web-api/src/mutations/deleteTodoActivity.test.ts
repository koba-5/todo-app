import setupJest from '../framework/jest/setupJest';

const { server } = setupJest();

describe('Mutation deleteTodoActivity', () => {
  test('The case to delete the todo activity', async () => {
    /* given */
    const expected = { deleteTodoActivity: 100000 };

    /* when */
    const actual = await server.executeOperation({
      query: 'mutation deleteTodoActivity($input: DeleteTodoActivityInput!) { deleteTodoActivity(input: $input) }',
      variables: { input: { id: 100000 } },
    });

    /* then */
    expect(actual.data).toMatchObject(expected);
  });
});
