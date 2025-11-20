import { publicProcedure } from '../../create-context';
import { z } from 'zod';
import { UpdateUserProfileSchema } from '../../../db/schema';
import { db } from '../../../db/storage';

export const updateProfileProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
    updates: UpdateUserProfileSchema,
  }))
  .mutation(async ({ input }) => {
    const user = db.users.update(input.userId, input.updates);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return user;
  });

export default updateProfileProcedure;
