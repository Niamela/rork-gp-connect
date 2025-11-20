import { publicProcedure } from "../../create-context";
import { CreateConversationSchema } from "../../../db/schema";
import { db } from "../../../db/storage";
import { z } from "zod";

export const createConversationProcedure = publicProcedure
  .input(CreateConversationSchema.extend({ userId: z.string() }))
  .mutation(async ({ input }) => {
    const userId = input.userId;
    const user = db.users.findById(userId);
    
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const existingConversation = db.conversations.findExisting(userId, input.otherUserId);
    if (existingConversation) {
      return existingConversation;
    }

    const conversation = db.conversations.create({
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      participants: [
        {
          userId: userId,
          userName: `${user.firstName} ${user.lastName}`,
          isGP: user.isGP,
        },
        {
          userId: input.otherUserId,
          userName: input.otherUserName,
          isGP: input.otherUserIsGP,
        },
      ],
      createdAt: new Date().toISOString(),
      requestId: input.requestId,
      travelId: input.travelId,
    });

    return conversation;
  });

export default createConversationProcedure;
