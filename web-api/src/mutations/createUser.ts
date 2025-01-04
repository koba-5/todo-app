import DbTx, { TxClient } from '../framework/prisma';
import { CreateUserInput, MutationResolvers } from '../framework/graphql/generated';
import GraphQLNotFound from '../framework/error/GraphQLNotFound';

type UpdateUserInput = Omit<CreateUserInput, 'id'> & { id: number };

const createUser: MutationResolvers['createUser'] = async (_, { input }) =>
  await new DbTx().execute(async (tx) => {
    switch (typeof input.id) {
      case 'number':
        await validateToUpdate(tx, input as UpdateUserInput);
        return await _updateUser(tx, input as UpdateUserInput);
      default:
        return await _createUser(tx, input);
    }
  });

export default createUser;

async function validateToUpdate(tx: TxClient, { id }: UpdateUserInput) {
  const user = await tx.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) throw new GraphQLNotFound({ message: `条件に該当するUserは存在しません (user.id=${id})` });
}

async function _createUser(
  tx: TxClient,
  { name_sei, name_mei, name_sei_kana, name_mei_kana }: Omit<CreateUserInput, 'id'>,
) {
  const user = await tx.user.create({
    data: { name_sei, name_mei, name_sei_kana, name_mei_kana },
  });
  return user.id;
}

async function _updateUser(tx: TxClient, { id, name_sei, name_mei, name_sei_kana, name_mei_kana }: UpdateUserInput) {
  const user = await tx.user.update({
    data: {
      name_sei,
      name_mei,
      name_sei_kana,
      name_mei_kana,
    },
    where: {
      id,
    },
  });
  return user.id;
}
