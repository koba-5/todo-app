import _ApolloServer from './framework/graphql/_ApolloServer';

const PORT = 8081;

const server = new _ApolloServer();
server._listen({ port: PORT });
