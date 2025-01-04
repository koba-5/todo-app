import { PrismaClient } from '@prisma/client';
import { TxClient } from '../../framework/prisma';
import NullPointerError from '../../framework/error/NullPointerError';

type Tbl = Exclude<keyof TxClient, symbol | '$executeRaw' | '$executeRawUnsafe' | '$queryRaw' | '$queryRawUnsafe'>;

export default class Master<T extends { id: number; name: string }, G> {
  tbl: Tbl;
  values: Array<T> = [];

  constructor(tbl: Tbl) {
    this.tbl = tbl;
  }

  async cache() {
    this.values = await new PrismaClient().$transaction(async (tx) => ((await tx[this.tbl]) as any).findMany());
  }

  getId(name: string) {
    const id = this.values.find((v) => v.name === name)?.id;
    if (id) return id;
    throw new NullPointerError({ message: 'id = null' });
  }

  getValue(id: number): G {
    const name = this.values.find((v) => v.id === id)?.name;
    if (name) return name as G;
    throw new NullPointerError({ message: 'name = null' });
  }
}
