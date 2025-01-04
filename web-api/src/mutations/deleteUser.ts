import DbTx, { TxClient } from '../framework/prisma';
import { DeleteUserInput, MutationResolvers } from '../framework/graphql/generated';
import GraphQLNotFound from '../framework/error/GraphQLNotFound';

const deleteUser: MutationResolvers['deleteUser'] = async (_, { input }) =>
  await new DbTx().execute(async (tx) => {
    await validate(tx, input);

    await _deleteTodo(tx, input);

    return await _deleteUser(tx, input);
  });

export default deleteUser;

async function validate(tx: TxClient, { id }: DeleteUserInput) {
  const user = await tx.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) throw new GraphQLNotFound({ message: `条件に該当するUserは存在しません (user.id=${id})` });
}

async function _deleteTodo(tx: TxClient, { id }: DeleteUserInput) {
  const todos = await tx.todo.findMany({
    where: {
      user_id: id,
    },
  });

  if (todos.length) {
    const todoIds = todos.map((todo) => todo.id);

    await tx.todo_activity.deleteMany({
      where: {
        todo_id: {
          in: todoIds,
        },
      },
    });

    await tx.todo.deleteMany({
      where: {
        user_id: id,
      },
    });
  }
}

async function _deleteUser(tx: TxClient, { id }: DeleteUserInput) {
  const user = await tx.user.delete({
    where: {
      id,
    },
  });
  return user.id;
}
