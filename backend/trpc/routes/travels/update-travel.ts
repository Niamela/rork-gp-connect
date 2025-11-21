import { publicProcedure } from '../../create-context.js';
import { z } from 'zod';
import { UpdateTravelAnnouncementSchema } from '../../../db/schema.js';
import { db } from '../../../db/storage.js';

export const updateTravelProcedure = publicProcedure
  .input(z.object({
    travelId: z.string(),
    updates: UpdateTravelAnnouncementSchema,
  }))
  .mutation(async ({ input }) => {
    const travel = db.travelAnnouncements.update(input.travelId, input.updates);
    
    if (!travel) {
      throw new Error('Annonce de voyage non trouvée');
    }

    return travel;
  });

export default updateTravelProcedure;
