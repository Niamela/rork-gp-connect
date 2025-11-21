import { publicProcedure } from '../../create-context.js';
import { CreateTravelAnnouncementSchema } from '../../../db/schema.js';
import { db } from '../../../db/storage.js';

export const createTravelProcedure = publicProcedure
  .input(CreateTravelAnnouncementSchema)
  .mutation(async ({ input }) => {
    const user = db.users.findById(input.gpId);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    if (!user.isGP || !user.gpSubscription?.isActive) {
      throw new Error('Vous devez avoir un abonnement GP actif pour créer une annonce de voyage');
    }

    const travel = db.travelAnnouncements.create({
      id: `travel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return travel;
  });

export default createTravelProcedure;
