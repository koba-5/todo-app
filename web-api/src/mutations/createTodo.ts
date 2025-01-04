import GraphQLBadRequest from '../framework/error/GraphQLBadRequest';
import GraphQLNotFound from '../framework/error/GraphQLNotFound';
import { CreateTodoInput, MutationResolvers } from '../framework/graphql/generated';
import DbTx, { TxClient } from '../framework/prisma';
import cache from '../cache/master';

type UpdateTodoInput = Omit<CreateTodoInput, 'id'> & { id: number };

const createTodo: MutationResolvers['createTodo'] = async (_, { input }) =>
  await new DbTx().execute(async (tx) => {
    await validate(tx, input);

    switch (typeof input.id) {
      case 'number':
        await validateToUpdate(tx, input as UpdateTodoInput);
        return await _updateTodo(tx, input as UpdateTodoInput);
      default:
        return await _createTodo(tx, input);
    }
  });

export default createTodo;

async function validate(tx: TxClient, { user_id, start_date, end_date }: CreateTodoInput) {
  if (start_date != undefined && end_date != undefined && start_date > end_date) {
    throw new GraphQLBadRequest({
      message: `start_date,end_dateの値が不正です (start_date(${start_date}) > end_date(${end_date}))`,
    });
  }

  const user = await tx.user.findUnique({
    where: {
      id: user_id,
    },
  });
  if (!user) throw new GraphQLNotFound({ message: `条件に該当するUserは存在しません (user.id=${user_id})` });
}

async function validateToUpdate(tx: TxClient, { id }: UpdateTodoInput) {
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
  if (childTodoList.length) throw new GraphQLBadRequest({ message: `ChildTodoが存在します (todo.parent_id=${id})` });
}

async function _createTodo(
  tx: TxClient,
  { user_id, title, progress, priority, start_date, end_date }: Omit<CreateTodoInput, 'id'>,
) {
  const todo = await tx.todo.create({
    data: {
      user_id,
      title,
      progress_id: cache.progress.getId(progress),
      priority_id: cache.priority.getId(priority),
      start_date,
      end_date,
    },
  });
  return todo.id;
}

async function _updateTodo(
  tx: TxClient,
  { id, user_id, title, progress, priority, start_date, end_date }: UpdateTodoInput,
) {
  const todo = await tx.todo.update({
    data: {
      user_id,
      title,
      progress_id: cache.progress.getId(progress),
      priority_id: cache.priority.getId(priority),
      start_date,
      end_date,
    },
    where: {
      id,
    },
  });
  return todo.id;
}
