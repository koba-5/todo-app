import GraphQLBadRequest from '../framework/error/GraphQLBadRequest';
import GraphQLNotFound from '../framework/error/GraphQLNotFound';
import { CreateTodoActivityInput, MutationResolvers } from '../framework/graphql/generated';
import DbTx, { TxClient } from '../framework/prisma';

type UpdateTodoActivityInput = Omit<CreateTodoActivityInput, 'id'> & { id: number };

const createTodoActivity: MutationResolvers['createTodoActivity'] = async (_, { input }) =>
  await new DbTx().execute(async (tx) => {
    await validate(tx, input);

    switch (typeof input.id) {
      case 'number':
        validateToUpdate(tx, input as UpdateTodoActivityInput);
        return await _updateTodo(tx, input as UpdateTodoActivityInput);
      default:
        return await _createTodo(tx, input);
    }
  });

async function validate(tx: TxClient, { todo_id, content }: CreateTodoActivityInput) {
  if (content === '') throw new GraphQLBadRequest({ message: '' });

  const activity = tx.todo.findUnique({
    where: {
      id: todo_id,
    },
  });
  if (!activity) throw new GraphQLNotFound({ message: `条件に該当するTodoは存在しません (todo.id=${todo_id})` });
}

async function validateToUpdate(tx: TxClient, { id }: UpdateTodoActivityInput) {
  const activity = tx.todo_activity.findUnique({
    where: {
      id,
    },
  });
  if (!activity)
    throw new GraphQLNotFound({ message: `条件に該当するTodo Activityは存在しません (todo_activity.id=${id})` });
}

async function _createTodo(tx: TxClient, { todo_id, content }: Omit<CreateTodoActivityInput, 'id'>) {
  const activity = await tx.todo_activity.create({
    data: {
      todo_id,
      content,
    },
  });
  return activity.id;
}

async function _updateTodo(tx: TxClient, { id, todo_id, content }: UpdateTodoActivityInput) {
  const activity = await tx.todo_activity.update({
    data: {
      todo_id,
      content,
    },
    where: {
      id,
    },
  });
  return activity.id;
}

export default createTodoActivity;
