import { publicProcedure } from '../../create-context.js';
import { z } from 'zod';
import { db } from '../../../db/storage.js';

export const subscribeGpProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input }) => {
    const user = db.users.findById(input.userId);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const updated = db.users.update(input.userId, {
      isGP: true,
      gpSubscription: {
        isActive: true,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        amount: 10000,
      },
    });

    return updated;
  });

export default subscribeGpProcedure;
