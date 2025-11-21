import { publicProcedure } from "../../create-context.js";
import { SendMessageSchema } from "../../../db/schema.js";
import { db } from "../../../db/storage.js";
import { z } from "zod";

export const sendMessageProcedure = publicProcedure
  .input(SendMessageSchema.extend({ userId: z.string() }))
  .mutation(async ({ input }) => {
    const userId = input.userId;
    const user = db.users.findById(userId);
    
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const conversation = db.conversations.findById(input.conversationId);
    if (!conversation) {
      throw new Error("Conversation non trouvée");
    }

    const isParticipant = conversation.participants.some(p => p.userId === userId);
    if (!isParticipant) {
      throw new Error("Vous n'êtes pas participant de cette conversation");
    }

    const message = db.messages.create({
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId: input.conversationId,
      senderId: userId,
      senderName: `${user.firstName} ${user.lastName}`,
      content: input.content,
      timestamp: new Date().toISOString(),
      read: false,
    });

    db.conversations.update(input.conversationId, {
      lastMessage: input.content,
      lastMessageTime: message.timestamp,
    });

    return message;
  });

export default sendMessageProcedure;
