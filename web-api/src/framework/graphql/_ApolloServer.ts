import { ListenOptions } from 'net';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { ApolloServer } from 'apollo-server';

export default class _ApolloServer extends ApolloServer {
  constructor() {
    super({ typeDefs, resolvers });
  }

  async _listen(option: ListenOptions) {
    const { url } = await this.listen(option);
    console.log(`The server is running on url ${url}.`);
  }
}
