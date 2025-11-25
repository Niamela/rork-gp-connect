import { publicProcedure } from '../../create-context';
import { CreateUserProfileSchema } from '../../../db/schema';
import { db } from '../../../db/storage';

export const createProfileProcedure = publicProcedure
  .input(CreateUserProfileSchema)
  .mutation(async ({ input }) => {
    const existingUser = db.users.findByContact(input.contact);
    
    if (existingUser) {
      throw new Error('Un utilisateur avec ce contact existe déjà');
    }

    const user = db.users.create({
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...input,
      isVerified: false,
      createdAt: new Date().toISOString(),
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

export default createProfileProcedure;
