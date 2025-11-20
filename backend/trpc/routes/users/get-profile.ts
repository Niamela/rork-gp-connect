import { publicProcedure } from '../../create-context';
import { z } from 'zod';
import { db } from '../../../db/storage';

export const getProfileProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const user = db.users.findById(input.userId);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return user;
  });

export default getProfileProcedure;
