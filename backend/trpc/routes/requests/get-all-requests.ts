import { publicProcedure } from '../../create-context.js';
import { db } from '../../../db/storage.js';

export const getAllRequestsProcedure = publicProcedure
  .query(async () => {
    return db.requestAnnouncements.getAll();
  });

export default getAllRequestsProcedure;
