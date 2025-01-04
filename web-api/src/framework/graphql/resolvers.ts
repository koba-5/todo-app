import { Resolvers } from './generated';
import getTodoList from '../../queries/getTodoList';
import getTodo from '../../queries/getTodo';
import getUser from '../../queries/getUser';
import createTodo from '../../mutations/createTodo';
import deleteTodo from '../../mutations/deleteTodo';
import createUser from '../../mutations/createUser';
import deleteUser from '../../mutations/deleteUser';
import createTodoActivity from '../../mutations/createTodoActivity';
import deleteTodoActivity from '../../mutations/deleteTodoActivity';
import _GraphQLScalarType from './_GraphQLScalarType';

const GraphQLScalarType = new _GraphQLScalarType();

export const resolvers: Resolvers = {
  _Date: GraphQLScalarType._Date,
  _DateTime: GraphQLScalarType._DateTime,
  Query: {
    getTodo,
    getTodoList,
    getUser,
  },
  Mutation: {
    createUser,
    deleteUser,
    createTodo,
    deleteTodo,
    createTodoActivity,
    deleteTodoActivity,
  },
};
