import setupJest from '../framework/jest/setupJest';

const { server } = setupJest();

describe('Mutation CreateTodo', () => {
  describe('The cases to create', () => {
    test('The case to create the todo', async () => {
      /* given */
      const expected = {};

      /* when */
      const actual = await server.executeOperation({
        query: 'mutation createTodo($input: CreateTodoInput!) { createTodo(input: $input) }',
        variables: {
          input: {
            user_id: 100000,
            title: 'ApolloClient',
            progress: 'DONE',
            priority: 'HIGH',
            start_date: '2024-01-03T10:00:00+09:00',
            end_date: '2024-01-04T00:00:00+09:00',
            parent_id: 100000,
          },
        },
      });

      /* then */
      expect(actual.data).toMatchObject(expected);
    });
  });

  describe('The cases to update', () => {
    test('The case to update the todo', async () => {
      /* given */
      const expected = { createTodo: 100003 };

      /* when */
      const actual = await server.executeOperation({
        query: 'mutation createTodo($input: CreateTodoInput!) { createTodo(input: $input) }',
        variables: {
          input: {
            id: 100003,
            user_id: 100000,
            title: 'ApolloServer_updated',
            progress: 'DONE',
            priority: 'HIGH',
            start_date: '2024-01-03T00:00:00+09:00',
            end_date: '2024-01-04T00:00:00+09:00',
            parent_id: 100000,
          },
        },
      });

      /* then */
      expect(actual.data).toMatchObject(expected);
    });
  });
});
