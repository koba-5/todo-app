import { priority, progress } from '@prisma/client';
import { Priority, Progress } from '../../framework/graphql/generated';
import Master from './types';

export default (() => {
  const map = {
    progress: new Master<progress, Progress>('progress'),
    priority: new Master<priority, Priority>('priority'),
  };

  Object.values(map).forEach(async (m) => await m.cache());

  return map;
})();
