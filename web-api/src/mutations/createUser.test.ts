import setupJest from '../framework/jest/setupJest';

const { server } = setupJest();

describe('Mutation CreateUser', () => {
  describe('The cases to create', () => {
    test('The case to create the user', async () => {
      /* given */
      const expected = {};

      /* when */
      const actual = await server.executeOperation({
        query: 'mutation createUser($input: CreateUserInput!) { createUser(input: $input) }',
        variables: { input: { name_sei: '山田', name_mei: '太郎', name_sei_kana: 'ヤマダ', name_mei_kana: 'タロウ' } },
      });

      /* then */
      expect(actual.data).toMatchObject(expected);
    });
  });

  describe('The cases to update', () => {
    test('The case to update the user', async () => {
      /* given */
      const expected = { createUser: 100000 };

      /* when */
      const actual = await server.executeOperation({
        query: 'mutation createUser($input: CreateUserInput!) { createUser(input: $input) }',
        variables: {
          input: {
            id: 100000,
            name_sei: '佐藤_updated',
            name_mei: '二郎_updated',
            name_sei_kana: 'サトウ_updated',
            name_mei_kana: '二郎_updated',
          },
        },
      });

      /* then */
      expect(actual.data).toMatchObject(expected);
    });
  });
});
