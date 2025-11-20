import type { UserProfile, TravelAnnouncement, RequestAnnouncement, Conversation, Message } from './schema';

const users = new Map<string, UserProfile>();
const travelAnnouncements = new Map<string, TravelAnnouncement>();
const requestAnnouncements = new Map<string, RequestAnnouncement>();
const conversations = new Map<string, Conversation>();
const messages = new Map<string, Message>();

export const db = {
  users: {
    create: (user: UserProfile) => {
      users.set(user.id, user);
      return user;
    },
    findById: (id: string) => {
      return users.get(id) || null;
    },
    findByContact: (contact: string) => {
      return Array.from(users.values()).find(u => u.contact === contact) || null;
    },
    update: (id: string, updates: Partial<UserProfile>) => {
      const user = users.get(id);
      if (!user) return null;
      const updated = { ...user, ...updates };
      users.set(id, updated);
      return updated;
    },
    delete: (id: string) => {
      return users.delete(id);
    },
    getAll: () => {
      return Array.from(users.values());
    },
  },
  travelAnnouncements: {
    create: (announcement: TravelAnnouncement) => {
      travelAnnouncements.set(announcement.id, announcement);
      return announcement;
    },
    findById: (id: string) => {
      return travelAnnouncements.get(id) || null;
    },
    findByGpId: (gpId: string) => {
      return Array.from(travelAnnouncements.values()).filter(a => a.gpId === gpId);
    },
    update: (id: string, updates: Partial<TravelAnnouncement>) => {
      const announcement = travelAnnouncements.get(id);
      if (!announcement) return null;
      const updated = { ...announcement, ...updates, updatedAt: new Date().toISOString() };
      travelAnnouncements.set(id, updated);
      return updated;
    },
    delete: (id: string) => {
      return travelAnnouncements.delete(id);
    },
    getAll: () => {
      return Array.from(travelAnnouncements.values());
    },
  },
  requestAnnouncements: {
    create: (announcement: RequestAnnouncement) => {
      requestAnnouncements.set(announcement.id, announcement);
      return announcement;
    },
    findById: (id: string) => {
      return requestAnnouncements.get(id) || null;
    },
    findByUserId: (userId: string) => {
      return Array.from(requestAnnouncements.values()).filter(a => a.userId === userId);
    },
    delete: (id: string) => {
      return requestAnnouncements.delete(id);
    },
    getAll: () => {
      return Array.from(requestAnnouncements.values()).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  },
  conversations: {
    create: (conversation: Conversation) => {
      conversations.set(conversation.id, conversation);
      return conversation;
    },
    findById: (id: string) => {
      return conversations.get(id) || null;
    },
    findByUserId: (userId: string) => {
      return Array.from(conversations.values())
        .filter(c => c.participants.some(p => p.userId === userId))
        .sort((a, b) => {
          const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : new Date(a.createdAt).getTime();
          const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : new Date(b.createdAt).getTime();
          return bTime - aTime;
        });
    },
    update: (id: string, updates: Partial<Conversation>) => {
      const conversation = conversations.get(id);
      if (!conversation) return null;
      const updated = { ...conversation, ...updates };
      conversations.set(id, updated);
      return updated;
    },
    delete: (id: string) => {
      return conversations.delete(id);
    },
    findExisting: (userId1: string, userId2: string) => {
      return Array.from(conversations.values()).find(c => 
        c.participants.some(p => p.userId === userId1) &&
        c.participants.some(p => p.userId === userId2)
      ) || null;
    },
  },
  messages: {
    create: (message: Message) => {
      messages.set(message.id, message);
      return message;
    },
    findById: (id: string) => {
      return messages.get(id) || null;
    },
    findByConversationId: (conversationId: string) => {
      return Array.from(messages.values())
        .filter(m => m.conversationId === conversationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    },
    markAsRead: (id: string) => {
      const message = messages.get(id);
      if (!message) return null;
      const updated = { ...message, read: true };
      messages.set(id, updated);
      return updated;
    },
    markConversationAsRead: (conversationId: string, userId: string) => {
      const conversationMessages = Array.from(messages.values())
        .filter(m => m.conversationId === conversationId && m.senderId !== userId);
      conversationMessages.forEach(m => {
        messages.set(m.id, { ...m, read: true });
      });
      return conversationMessages;
    },
  },
};
