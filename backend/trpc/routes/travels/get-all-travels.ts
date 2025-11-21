import { publicProcedure } from '../../create-context.js';
import { db } from '../../../db/storage.js';

export const getAllTravelsProcedure = publicProcedure
  .query(async () => {
    return db.travelAnnouncements.getAll();
  });

export default getAllTravelsProcedure;
