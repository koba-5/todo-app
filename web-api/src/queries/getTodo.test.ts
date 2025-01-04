import setupJest from '../framework/jest/setupJest';

const { server } = setupJest();

describe('Query getTodo', () => {
  test('The case to response a todo.', async () => {
    /* given */
    const expected = {
      getTodo: {
        id: 100000,
        user_id: 100000,
        title: 'GraphQLの勉強をする',
        progress: 'ON_HOLD',
        priority: 'HIGH',
        start_date: '2023-12-31',
        end_date: '2024-01-09',
        content: '- Why\n  - GraphQLをあまり触ったことがない\n  - REST API以外の技術を触りた\n - How\n  - 実装してみる',
        created_at: '2024-12-30T04:03:03.000Z',
        updated_at: '2024-12-30T05:04:04.000Z',
        activities: [
          {
            id: 100000,
            content: 'ドキュメントを読みながら実装開始してみた',
            created_at: '2024-12-30T02:01:01.000Z',
            updated_at: '2024-12-30T03:02:02.000Z',
          },
        ],
        children: [
          {
            id: 100001,
            title: 'Query',
            progress: 'DONE',
            priority: 'LOW',
            start_date: '2023-12-31',
            end_date: '2024-01-02',
            content: '- How\n  - 実装してみる',
            created_at: '2024-12-30T04:03:03.000Z',
            updated_at: '2024-12-30T05:04:04.000Z',
            activities: [
              {
                id: 100002,
                content: '.....',
                created_at: '2024-12-31T02:01:01.000Z',
                updated_at: '2024-12-31T03:02:02.000Z',
              },
              {
                id: 100001,
                content: '...',
                created_at: '2024-12-31T02:01:01.000Z',
                updated_at: '2024-12-31T03:02:02.000Z',
              },
            ],
          },
          {
            id: 100002,
            title: 'Mutation',
            progress: 'IN_PROGRESS',
            priority: 'NORMAL',
            start_date: null,
            end_date: null,
            content: null,
            created_at: '2024-12-30T02:01:01.000Z',
            updated_at: '2024-12-30T03:02:02.000Z',
            activities: [],
          },
        ],
      },
    };

    /* when */
    const actual = await server.executeOperation({
      query:
        'query getTodo($input: GetTodoInput!) { getTodo(input: $input) { id, user_id, title, progress, priority, start_date, end_date, content, created_at, updated_at, activities { id, content, created_at, updated_at }, children { id, title, progress, priority, start_date, end_date, content, created_at, updated_at, activities { id, content, created_at, updated_at } } } }',
      variables: { input: { id: 100000 } },
    });

    /* then */
    expect(actual.data).toMatchObject(expected);
  });
});
