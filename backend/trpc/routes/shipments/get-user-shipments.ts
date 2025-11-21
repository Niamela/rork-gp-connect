import { z } from 'zod';
import { publicProcedure } from '../../create-context.js';
import { db } from '../../../db/storage.js';

export const getUserShipmentsProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    console.log('[getUserShipmentsProcedure] Getting shipments for user:', input.userId);
    
    const shipments = db.shipments.findByUserId(input.userId);
    
    console.log('[getUserShipmentsProcedure] Found shipments:', shipments.length);
    return shipments;
  });

export default getUserShipmentsProcedure;
