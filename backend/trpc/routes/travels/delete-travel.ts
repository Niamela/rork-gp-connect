import { publicProcedure } from '../../create-context.js';
import { z } from 'zod';
import { db } from '../../../db/storage.js';

export const deleteTravelProcedure = publicProcedure
  .input(z.object({ travelId: z.string() }))
  .mutation(async ({ input }) => {
    const deleted = db.travelAnnouncements.delete(input.travelId);
    
    if (!deleted) {
      throw new Error('Annonce de voyage non trouvée');
    }

    return { success: true };
  });

export default deleteTravelProcedure;
