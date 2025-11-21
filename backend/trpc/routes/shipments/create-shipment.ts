import { publicProcedure } from '../../create-context.js';
import { CreateShipmentSchema } from '../../../db/schema.js';
import { db } from '../../../db/storage.js';

export const createShipmentProcedure = publicProcedure
  .input(CreateShipmentSchema)
  .mutation(async ({ input }) => {
    console.log('[createShipmentProcedure] Creating shipment for request:', input.requestId);
    
    const shipment = db.shipments.create({
      id: `ship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('[createShipmentProcedure] Shipment created:', shipment.id);
    return shipment;
  });

export default createShipmentProcedure;
