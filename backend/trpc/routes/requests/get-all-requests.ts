import { publicProcedure } from '../../create-context';
import { db } from '../../../db/storage';

export const getAllRequestsProcedure = publicProcedure
  .query(async () => {
    return db.requestAnnouncements.getAll();
  });

export default getAllRequestsProcedure;
