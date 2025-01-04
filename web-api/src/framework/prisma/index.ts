import { Prisma, PrismaClient } from '@prisma/client';
import executeTestData from './testData';

export type TxClient = Prisma.TransactionClient;

type DbTxFn<T> = (tx: TxClient) => Promise<T>;

export default class DbTx {
  private prisma;

  constructor() {
    switch (process.env.NODE_ENV) {
      case 'test':
        this.prisma = new PrismaClient({ log: ['warn', 'error'] });
        break;
      default:
        this.prisma = new PrismaClient();
    }
  }

  async execute<T>(fn: DbTxFn<T>) {
    switch (process.env.NODE_ENV) {
      case 'test':
        return this.executeMockDB(fn);
      default:
        return this.executeRealDB(fn);
    }
  }

  private async executeRealDB<T>(fn: DbTxFn<T>) {
    return await this.prisma.$transaction(async (tx) => await fn(tx));
  }

  private async executeMockDB<T>(fn: DbTxFn<T>) {
    return await this.prisma.$transaction(async (tx) => {
      await executeTestData(tx);
      const r = await fn(tx);
      await tx.$executeRaw`ROLLBACK;`;
      return r;
    });
  }
}
