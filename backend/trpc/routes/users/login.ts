import { publicProcedure } from '../../create-context';
import { z } from 'zod';
import { db } from '../../../db/storage';

export const loginProcedure = publicProcedure
  .input(z.object({ contact: z.string() }))
  .query(async ({ input }) => {
    console.log('[Backend] Login attempt with contact:', input.contact);
    
    const user = db.users.findByContact(input.contact);
    
    if (!user) {
      console.log('[Backend] User not found for contact:', input.contact);
      throw new Error('Utilisateur non trouvé');
    }

    console.log('[Backend] User found:', user);
    return user;
  });

export default loginProcedure;
