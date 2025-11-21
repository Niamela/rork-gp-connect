import { z } from 'zod';
import { publicProcedure } from '../../create-context.js';
import { db } from '../../../db/storage.js';

export const getGpShipmentsProcedure = publicProcedure
  .input(z.object({ gpId: z.string() }))
  .query(async ({ input }) => {
    console.log('[getGpShipmentsProcedure] Getting shipments for GP:', input.gpId);
    
    const shipments = db.shipments.findByGpId(input.gpId);
    
    console.log('[getGpShipmentsProcedure] Found shipments:', shipments.length);
    return shipments;
  });

export default getGpShipmentsProcedure;
