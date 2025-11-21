import { publicProcedure } from "../../create-context.js";
import { db } from "../../../db/storage.js";
import { z } from "zod";

export const getConversationsProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const userId = input.userId;
    const conversations = db.conversations.findByUserId(userId);
    return conversations;
  });

export default getConversationsProcedure;
