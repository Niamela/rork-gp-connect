import { publicProcedure } from "../../create-context";
import { z } from "zod";
import { db } from "../../../db/storage";

export const getMessagesProcedure = publicProcedure
  .input(z.object({ conversationId: z.string() }))
  .query(async ({ input }) => {
    const messages = db.messages.findByConversationId(input.conversationId);
    return messages;
  });

export default getMessagesProcedure;
