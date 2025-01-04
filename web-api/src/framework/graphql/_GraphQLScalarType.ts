import { GraphQLScalarType } from 'graphql';
import Unexpected from '../error/UnexpectedError';
import GraphQLBadRequest from '../error/GraphQLBadRequest';

export default class _GraphQLScalarType {
  _Date = new GraphQLScalarType({
    name: 'Date',
    serialize: (value) => {
      if (value instanceof Date) return value.toISOString().substring(0, 10);
      throw new Unexpected({ message: 'Dateの値が不正' });
    },
    parseValue: (value) => {
      if (typeof value === 'string') {
        if (value.length < 20) throw new Unexpected({ message: 'Dateの値が不正' });
        const d = new Date(value);
        if (d === new Date('invalid date')) throw new Unexpected({ message: 'Dateの値が不正' });
        d.setHours(0, 0, 0, 0);
        return d;
      }
      throw new GraphQLBadRequest({ message: 'Dateの値が不正' });
    },
  });

  _DateTime = new GraphQLScalarType({
    name: 'DateTime',
    serialize: (value) => {
      if (value instanceof Date) return value.toISOString();
      throw new Unexpected({ message: 'Dateの値が不正' });
    },
    parseValue: (value) => {
      if (typeof value === 'string') {
        const d = new Date(value);
        if (d === new Date('invalid date')) throw new Unexpected({ message: 'Dateの値が不正' });
        return d;
      }
      throw new GraphQLBadRequest({ message: 'Dateの値が不正' });
    },
  });
}
