import { publicProcedure } from "../../create-context";
import { z } from "zod";
import { db } from "../../../db/storage";

export const markAsReadProcedure = publicProcedure
  .input(z.object({ conversationId: z.string(), userId: z.string() }))
  .mutation(async ({ input }) => {
    const userId = input.userId;
    db.messages.markConversationAsRead(input.conversationId, userId);
    return { success: true };
  });

export default markAsReadProcedure;
