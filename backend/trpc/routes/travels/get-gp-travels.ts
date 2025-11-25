import { publicProcedure } from '../../create-context';
import { z } from 'zod';
import { db } from '../../../db/storage';

export const getGpTravelsProcedure = publicProcedure
  .input(z.object({ gpId: z.string() }))
  .query(async ({ input }) => {
    return db.travelAnnouncements.findByGpId(input.gpId);
  });

export default getGpTravelsProcedure;
