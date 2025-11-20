import { publicProcedure } from '../../create-context';
import { z } from 'zod';
import { db } from '../../../db/storage';

export const loginProcedure = publicProcedure
  .input(z.object({ 
    email: z.string().email('Email invalide'), 
    password: z.string().min(1, 'Le mot de passe est requis') 
  }))
  .query(async ({ input }) => {
    console.log('[Backend] Login attempt with email:', input.email);
    
    const user = db.users.findByEmail(input.email);
    
    if (!user) {
      console.log('[Backend] User not found for email:', input.email);
      throw new Error('Email ou mot de passe incorrect');
    }

    if (user.password !== input.password) {
      console.log('[Backend] Invalid password for email:', input.email);
      throw new Error('Email ou mot de passe incorrect');
    }

    console.log('[Backend] User authenticated:', user);
    return user;
  });

export default loginProcedure;
