import setupJest from '../framework/jest/setupJest';

const { server } = setupJest();

describe('Mutation CreateTodoActivity', () => {
  describe('The cases to create', () => {
    test('The case to create the todo activity', async () => {
      /* given */
      const expected = {};

      /* when */
      const actual = await server.executeOperation({
        query: 'mutation createTodoActivity($input: CreateTodoActivityInput!) { createTodoActivity(input: $input) }',
        variables: {
          input: {
            todo_id: 100000,
            content: 'テスト',
          },
        },
      });

      /* then */
      expect(actual.data).toMatchObject(expected);
    });
  });

  describe('The cases to update', () => {
    test('The case to update the todo activity', async () => {
      /* given */
      const expected = { createTodoActivity: 100000 };

      /* when */
      const actual = await server.executeOperation({
        query: 'mutation createTodoActivity($input: CreateTodoActivityInput!) { createTodoActivity(input: $input) }',
        variables: {
          input: {
            id: 100000,
            todo_id: 100000,
            content: 'テスト_update',
          },
        },
      });

      /* then */
      expect(actual.data).toMatchObject(expected);
    });
  });
});
