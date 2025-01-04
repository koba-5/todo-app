import GraphQLNotFound from '../framework/error/GraphQLNotFound';
import { GetUserInput, QueryResolvers } from '../framework/graphql/generated';
import DbTx, { TxClient } from '../framework/prisma';

const getUser: QueryResolvers['getUser'] = async (_, { input }) =>
  await new DbTx().execute(async (tx) => {
    return await _getUser(tx, input);
  });

export default getUser;

async function _getUser(tx: TxClient, { id }: GetUserInput) {
  const user = await tx.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) throw new GraphQLNotFound({ message: `条件に該当するUserは存在しません (user.id=${id})` });

  return user;
}
