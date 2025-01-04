import _ApolloServer from '../graphql/_ApolloServer';

export default function setupJest() {
  return { server: new _ApolloServer() };
}
