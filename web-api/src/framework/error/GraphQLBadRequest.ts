import { GraphQLError } from 'graphql';

export default class GraphQLBadRequest extends GraphQLError {
  constructor({ message }: { message: string }) {
    super(message, {
      extensions: { code: 'BAD_REQUEST' },
    });
  }
}
