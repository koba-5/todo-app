import GraphQLNotFound from '../framework/error/GraphQLNotFound';
import { DeleteTodoActivityInput, DeleteTodoInput, MutationResolvers } from '../framework/graphql/generated';
import DbTx, { TxClient } from '../framework/prisma';

const deleteTodoActivity: MutationResolvers['deleteTodoActivity'] = async (_, { input }) =>
  await new DbTx().execute(async (tx) => {
    await validate(tx, input);

    return await _deleteTodoActivity(tx, input);
  });

export default deleteTodoActivity;

async function validate(tx: TxClient, { id }: DeleteTodoActivityInput) {
  const activity = tx.todo_activity.findUnique({
    where: {
      id,
    },
  });
  if (!activity)
    throw new GraphQLNotFound({ message: `条件に該当するTodo Activityは存在しません (todo_activity.id=${id})` });
}

async function _deleteTodoActivity(tx: TxClient, { id }: DeleteTodoInput) {
  const activity = await tx.todo_activity.delete({
    where: {
      id,
    },
  });
  return activity.id;
}
