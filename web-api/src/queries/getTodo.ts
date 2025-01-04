import { GetTodoInput, QueryResolvers, TodoActivity } from '../framework/graphql/generated';
import GraphQLNotFound from '../framework/error/GraphQLNotFound';
import DbTx, { TxClient } from '../framework/prisma';
import { todo, todo_activity } from '@prisma/client';
import cache from '../cache/master';

const getTodo: QueryResolvers['getTodo'] = async (_, { input }) =>
  await new DbTx().execute(async (tx) => {
    const parent = await getParent(tx, input);
    const children = await getChildren(tx, parent);

    const todoIds = convertTodoIds({ parent, children });
    const activities = await getActivities(tx, todoIds);

    return convertResponse({ parent, children, activities });
  });

export default getTodo;

async function getParent(tx: TxClient, { id }: GetTodoInput) {
  const todo = await tx.todo.findUnique({
    where: { id },
  });

  if (!todo)
    throw new GraphQLNotFound({
      message: `条件に該当するTodoは存在しません (todo.id=${id})`,
    });

  return todo;
}

async function getChildren(tx: TxClient, { id }: todo) {
  return await tx.todo.findMany({
    where: { parent_id: id },
  });
}

async function getActivities(tx: TxClient, todoIds: Array<number>) {
  return await tx.todo_activity.findMany({
    where: {
      todo_id: {
        in: todoIds,
      },
    },
  });
}

function convertTodoIds({ parent, children }: { parent: todo; children: Array<todo> }) {
  const parentId = parent.id;
  const childTodoIds = children.map((todo) => todo.id);
  childTodoIds.push(parentId);

  return Array.from(new Set(childTodoIds));
}

function convertResponse({
  parent,
  children,
  activities,
}: {
  parent: todo;
  children: Array<todo>;
  activities: Array<todo_activity>;
}) {
  const activityMap = activities.reduce((pre, { id, todo_id, content, created_at, updated_at }) => {
    if (pre.get(todo_id)) {
      pre.set(todo_id, [{ id, content, created_at, updated_at }, ...(pre.get(todo_id) as Array<TodoActivity>)]);
    } else {
      pre.set(id, [{ id, content, created_at, updated_at }]);
    }
    return pre;
  }, new Map<number, Array<TodoActivity>>());

  const _children = children.map((child) => ({
    id: child.id,
    title: child.title,
    progress: cache.progress.getValue(child.progress_id),
    priority: cache.priority.getValue(child.progress_id),
    start_date: child.start_date,
    end_date: child.end_date,
    content: child.content,
    activities: activityMap.get(child.id) || [],
    created_at: child.created_at,
    updated_at: child.updated_at,
  }));

  return {
    id: parent.id,
    user_id: parent.id,
    title: parent.title,
    progress: cache.progress.getValue(parent.progress_id),
    priority: cache.priority.getValue(parent.priority_id),
    start_date: parent.start_date,
    end_date: parent.end_date,
    content: parent.content,
    activities: activityMap.get(parent.id) || [],
    created_at: parent.created_at,
    updated_at: parent.updated_at,
    children: _children,
  };
}
