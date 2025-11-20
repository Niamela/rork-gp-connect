import { publicProcedure } from '../../create-context';
import { db } from '../../../db/storage';

export const getAllTravelsProcedure = publicProcedure
  .query(async () => {
    return db.travelAnnouncements.getAll();
  });

export default getAllTravelsProcedure;
