import { publicProcedure } from '../../create-context';
import { UpdateShipmentStatusSchema } from '../../../db/schema';
import { db } from '../../../db/storage';
import { TRPCError } from '@trpc/server';

export const updateShipmentStatusProcedure = publicProcedure
  .input(UpdateShipmentStatusSchema)
  .mutation(async ({ input }) => {
    console.log('[updateShipmentStatusProcedure] Updating shipment status:', input.shipmentId);
    
    const shipment = db.shipments.findById(input.shipmentId);
    if (!shipment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Envoi non trouvé',
      });
    }

    const trackingUpdate = {
      status: input.status,
      location: input.location,
      notes: input.notes,
      timestamp: new Date().toISOString(),
    };

    const updatedShipment = db.shipments.update(input.shipmentId, {
      status: input.status,
      trackingHistory: [...shipment.trackingHistory, trackingUpdate],
    });

    console.log('[updateShipmentStatusProcedure] Shipment status updated:', updatedShipment?.status);
    return updatedShipment;
  });

export default updateShipmentStatusProcedure;
