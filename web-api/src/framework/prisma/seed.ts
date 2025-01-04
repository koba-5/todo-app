import { PrismaClient } from '@prisma/client';

(async function () {
  await new PrismaClient().$transaction(async (tx) => {
    await tx.progress.createMany({
      data: [
        { id: 1, name: 'NOT_STARTED' },
        { id: 2, name: 'IN_PROGRESS' },
        { id: 3, name: 'DONE' },
        { id: 4, name: 'ON_HOLD' },
      ],
    });

    await tx.priority.createMany({
      data: [
        { id: 1, name: 'HIGH' },
        { id: 2, name: 'NORMAL' },
        { id: 3, name: 'LOW' },
      ],
    });
  });
})();
