import { TxClient } from '.';

export default async function executeTestData(tx: TxClient) {
  /* User */
  await tx.user.createMany({
    data: [
      {
        id: 100000,
        name_sei: '山田',
        name_mei: '太郎',
        name_sei_kana: 'ヤマダ',
        name_mei_kana: 'タロウ',
        created_at: '2024-12-30T15:01:01+09:00',
        updated_at: '2024-12-30T16:02:02+09:00',
      },
    ],
  });

  /* Todo */
  await tx.todo.createMany({
    data: [
      {
        id: 100000,
        user_id: 100000,
        title: 'GraphQLの勉強をする',
        progress_id: 4,
        priority_id: 1,
        start_date: '2024-01-01T01:01:01+09:00',
        end_date: '2024-01-10T02:02:02+09:00',
        content: '- Why\n  - GraphQLをあまり触ったことがない\n  - REST API以外の技術を触りた\n - How\n  - 実装してみる',
        created_at: '2024-12-30T13:03:03+09:00',
        updated_at: '2024-12-30T14:04:04+09:00',
      },
      {
        id: 100001,
        user_id: 100000,
        title: 'Query',
        progress_id: 3,
        priority_id: 2,
        start_date: '2024-01-01T01:01:01+09:00',
        end_date: '2024-01-03T02:02:02+09:00',
        content: '- How\n  - 実装してみる',
        created_at: '2024-12-30T13:03:03+09:00',
        updated_at: '2024-12-30T14:04:04+09:00',
        parent_id: 100000,
      },
      {
        id: 100002,
        user_id: 100000,
        title: 'Mutation',
        progress_id: 2,
        priority_id: 3,
        created_at: '2024-12-30T11:01:01+09:00',
        updated_at: '2024-12-30T12:02:02+09:00',
        parent_id: 100000,
      },
      {
        id: 100003,
        user_id: 100000,
        title: 'ApolloServer',
        progress_id: 1,
        priority_id: 1,
        created_at: '2024-12-30T11:01:01+09:00',
        updated_at: '2024-12-30T12:02:02+09:00',
      },
    ],
  });

  /* Todo Activity */
  await tx.todo_activity.createMany({
    data: [
      {
        id: 100000,
        todo_id: 100000,
        content: 'ドキュメントを読みながら実装開始してみた',
        created_at: '2024-12-30T11:01:01+09:00',
        updated_at: '2024-12-30T12:02:02+09:00',
      },
      {
        id: 100001,
        todo_id: 100001,
        content: '...',
        created_at: '2024-12-31T11:01:01+09:00',
        updated_at: '2024-12-31T12:02:02+09:00',
      },
      {
        id: 100002,
        todo_id: 100001,
        content: '.....',
        created_at: '2024-12-31T11:01:01+09:00',
        updated_at: '2024-12-31T12:02:02+09:00',
      },
    ],
  });
}
