import { publicProcedure } from '../../create-context.js';
import { z } from 'zod';
import { UpdateUserProfileSchema } from '../../../db/schema.js';
import { db } from '../../../db/storage.js';

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

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

export default updateProfileProcedure;
