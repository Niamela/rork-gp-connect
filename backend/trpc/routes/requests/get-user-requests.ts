import { publicProcedure } from '../../create-context';
import { z } from 'zod';
import { db } from '../../../db/storage';

export const getUserRequestsProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    return db.requestAnnouncements.findByUserId(input.userId);
  });

export default getUserRequestsProcedure;
