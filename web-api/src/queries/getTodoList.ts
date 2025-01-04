import { GetTodoListInput, QueryResolvers, TodoActivity } from '../framework/graphql/generated';
import DbTx, { TxClient } from '../framework/prisma';
import GraphQLBadRequest from '../framework/error/GraphQLBadRequest';
import { todo, todo_activity } from '@prisma/client';
import cache from '../cache/master';

const getTodoList: QueryResolvers['getTodoList'] = async (_, { input }) =>
  await new DbTx().execute(async (tx) => {
    validate(input);

    const parents = await getParents(tx, input);
    const children = await getChildren(tx, parents);

    const todoIds = convertTodoIds({ parents, children });
    const activities = await getActivities(tx, todoIds);

    return convertResponse({ parents, children, activities });
  });

export default getTodoList;

function validate({ page, size }: GetTodoListInput) {
  if (page < 1) throw new GraphQLBadRequest({ message: 'pageの値が不正です' });
  if (size < 1 || size > 15) throw new GraphQLBadRequest({ message: 'sizeの値が不正です' });
}

async function getParents(tx: TxClient, { user_id, page, size }: GetTodoListInput) {
  const todoList = await tx.todo.findMany({
    where: { user_id },
    skip: (page - 1) * size,
    take: size,
  });

  return todoList;
}

async function getChildren(tx: TxClient, input: Array<todo>) {
  const parentIdList: Array<number> = [];
  input.forEach((todo) => todo.parent_id && parentIdList.push(todo.parent_id));

  if (!parentIdList.length) return [];

  return await tx.todo.findMany({
    where: {
      parent_id: {
        in: parentIdList,
      },
    },
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

function convertTodoIds({ parents, children }: { parents: Array<todo>; children: Array<todo> }) {
  const parentIds = parents.map((todo) => todo.id);
  const childTodoIds = children.map((todo) => todo.id);

  return Array.from(new Set(parentIds.concat(childTodoIds)));
}

function convertResponse({
  parents,
  children,
  activities,
}: {
  parents: Array<todo>;
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

  const parentIdList = parents.map((parent) => parent.id);
  const childrenMap = new Map(
    parentIdList.map((parentId) => [parentId, children.filter((child) => child.parent_id === parentId)]),
  );

  return parents.map((parent) => {
    const children = (() => {
      const _children = childrenMap.get(parent.id);
      if (!_children) return [];
      return _children.map((child) => ({
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
    })();

    return {
      id: parent.id,
      user_id: parent.user_id,
      title: parent.title,
      progress: cache.progress.getValue(parent.progress_id),
      priority: cache.priority.getValue(parent.priority_id),
      start_date: parent.start_date,
      end_date: parent.end_date,
      content: parent.content,
      activities: activityMap.get(parent.id) || [],
      created_at: parent.created_at,
      updated_at: parent.updated_at,
      children,
    };
  });
}
