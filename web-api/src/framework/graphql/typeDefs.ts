import { readFileSync } from 'fs';

export const typeDefs = readFileSync(`./src/framework/graphql/schema.graphql`, { encoding: 'utf-8' });
