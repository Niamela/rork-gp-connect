import { publicProcedure } from '../../create-context';
import { z } from 'zod';
import { db } from '../../../db/storage';

export const deleteRequestProcedure = publicProcedure
  .input(z.object({ requestId: z.string() }))
  .mutation(async ({ input }) => {
    const deleted = db.requestAnnouncements.delete(input.requestId);
    
    if (!deleted) {
      throw new Error('Annonce non trouvée');
    }

    return { success: true };
  });

export default deleteRequestProcedure;
