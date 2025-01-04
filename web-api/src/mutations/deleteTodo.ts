import GraphQLBadRequest from '../framework/error/GraphQLBadRequest';
import GraphQLNotFound from '../framework/error/GraphQLNotFound';
import { DeleteTodoInput, MutationResolvers } from '../framework/graphql/generated';
import DbTx, { TxClient } from '../framework/prisma';

const deleteTodo: MutationResolvers['deleteTodo'] = async (_, { input }) =>
  await new DbTx().execute(async (tx) => {
    await validate(tx, input);

    return await _deleteTodo(tx, input);
  });

export default deleteTodo;

async function validate(tx: TxClient, { id }: DeleteTodoInput) {
  const todo = await tx.todo.findUnique({
    where: {
      id,
    },
  });
  if (!todo) throw new GraphQLNotFound({ message: `条件に該当するTodoは存在しません (todo.id=${id})` });

  const childTodoList = await tx.todo.findMany({
    where: {
      parent_id: id,
    },
  });
  if (!childTodoList.length) throw new GraphQLBadRequest({ message: `ChildTodoが存在します (todo.parent_id=${id})` });
}

async function _deleteTodo(tx: TxClient, { id }: DeleteTodoInput) {
  await tx.todo_activity.deleteMany({
    where: {
      todo_id: id,
    },
  });

  const todo = await tx.todo.delete({
    where: {
      id,
    },
  });
  return todo.id;
}
