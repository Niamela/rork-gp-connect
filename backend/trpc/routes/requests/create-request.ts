import { publicProcedure } from '../../create-context.js';
import { CreateRequestAnnouncementSchema } from '../../../db/schema.js';
import { db } from '../../../db/storage.js';

export const createRequestProcedure = publicProcedure
  .input(CreateRequestAnnouncementSchema)
  .mutation(async ({ input }) => {
    console.log('[createRequestProcedure] Creating request for user:', input.userId);
    
    let user = db.users.findById(input.userId);
    
    if (!user) {
      console.log('[createRequestProcedure] User not found in DB, creating minimal user profile');
      user = db.users.create({
        id: input.userId,
        firstName: input.userName.split(' ')[0] || input.userName,
        lastName: input.userName.split(' ').slice(1).join(' ') || '',
        country: input.fromCountry,
        contact: input.contactInfo,
        isVerified: false,
        createdAt: new Date().toISOString(),
        isGP: false,
      });
      console.log('[createRequestProcedure] User created:', user.id);
    }

    const request = db.requestAnnouncements.create({
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...input,
      postedDate: 'À l\'instant',
      createdAt: new Date().toISOString(),
    });

    console.log('[createRequestProcedure] Request created:', request.id);
    return request;
  });

export default createRequestProcedure;
