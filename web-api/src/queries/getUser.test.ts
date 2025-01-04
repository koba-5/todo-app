import setupJest from '../framework/jest/setupJest';

const { server } = setupJest();

describe('Query getUser', () => {
  test('The case to response a user.', async () => {
    /* given */
    const expected = {
      getUser: {
        id: 100000,
        name_sei: '山田',
        name_mei: '太郎',
        name_sei_kana: 'ヤマダ',
        name_mei_kana: 'タロウ',
        created_at: '2024-12-30T06:01:01.000Z',
        updated_at: '2024-12-30T07:02:02.000Z',
      },
    };

    /* when */
    const actual = await server.executeOperation({
      query:
        'query getUser($input: GetUserInput!) { getUser(input: $input) { id, name_sei, name_mei, name_sei_kana, name_mei_kana, created_at, updated_at } }',
      variables: { input: { id: 100000 } },
    });

    /* then */
    expect(actual.data).toMatchObject(expected);
  });
});
