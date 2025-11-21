import { publicProcedure } from '../../create-context.js';
import { z } from 'zod';
import { db } from '../../../db/storage.js';

export const getUserRequestsProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    return db.requestAnnouncements.findByUserId(input.userId);
  });

export default getUserRequestsProcedure;
