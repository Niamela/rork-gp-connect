import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../create-context.js';
import { CreateUserProfileSchema } from '../../../db/schema.js';
import { db } from '../../../db/storage.js';

export const createProfileProcedure = publicProcedure
  .input(CreateUserProfileSchema)
  .mutation(async ({ input }) => {
    try {
      console.log('[CreateProfile] Received input:', input);
      
      const existingUser = db.users.findByContact(input.contact);
      
      if (existingUser) {
        console.log('[CreateProfile] User already exists with contact:', input.contact);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Un utilisateur avec ce contact existe déjà',
        });
      }

      const user = db.users.create({
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...input,
        isVerified: false,
        createdAt: new Date().toISOString(),
      });

      console.log('[CreateProfile] User created successfully:', user.id);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('[CreateProfile] Error:', error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erreur lors de la création du profil',
        cause: error,
      });
    }
  });

export default createProfileProcedure;
