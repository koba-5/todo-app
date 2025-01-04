import { GraphQLError } from 'graphql';

export default class GraphQLNotFound extends GraphQLError {
  constructor({ message }: { message: string }) {
    super(message, {
      extensions: { code: 'NOT_FOUND' },
    });
  }
}
