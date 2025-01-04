import setupJest from '../framework/jest/setupJest';

const { server } = setupJest();

describe('Mutation deleteUser', () => {
  test('The case to delete the user', async () => {
    /* given */
    const expected = { deleteUser: 100000 };

    /* when */
    const actual = await server.executeOperation({
      query: 'mutation deleteUser($input: DeleteUserInput!) { deleteUser(input: $input) }',
      variables: { input: { id: 100000 } },
    });

    /* then */
    expect(actual.data).toMatchObject(expected);
  });
});
