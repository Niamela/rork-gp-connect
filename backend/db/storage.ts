import type {
  UserProfile,
  TravelAnnouncement,
  RequestAnnouncement,
  Conversation,
  Message,
  Shipment,
} from "./schema";

// Check if we're in a serverless environment (Vercel, etc.)
const isServerless =
  typeof process !== "undefined" &&
  (process.env.VERCEL === "1" ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    !process.cwd);

// In-memory storage (used in serverless environments)
let users = new Map<string, UserProfile>();
let travelAnnouncements = new Map<string, TravelAnnouncement>();
let requestAnnouncements = new Map<string, RequestAnnouncement>();
let conversations = new Map<string, Conversation>();
let messages = new Map<string, Message>();
let shipments = new Map<string, Shipment>();

// File-based storage (only used in non-serverless environments)
if (!isServerless) {
  try {
    const fs = require("fs");
    const path = require("path");
    const DATA_DIR = path.join(process.cwd(), "data");

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    function loadData<T>(filename: string): Map<string, T> {
      const filepath = path.join(DATA_DIR, filename);
      try {
        if (fs.existsSync(filepath)) {
          const data = fs.readFileSync(filepath, "utf-8");
          const parsed = JSON.parse(data);
          return new Map(Object.entries(parsed));
        }
      } catch (error) {
        console.error(`Error loading ${filename}:`, error);
      }
      return new Map();
    }

    users = loadData<UserProfile>("users.json");
    travelAnnouncements = loadData<TravelAnnouncement>("travels.json");
    requestAnnouncements = loadData<RequestAnnouncement>("requests.json");
    conversations = loadData<Conversation>("conversations.json");
    messages = loadData<Message>("messages.json");
    shipments = loadData<Shipment>("shipments.json");
  } catch (error) {
    console.warn("File system not available, using in-memory storage:", error);
  }
}

function saveData<T>(filename: string, data: Map<string, T>): void {
  if (isServerless) {
    // In serverless, data is only in memory (no persistence)
    return;
  }

  try {
    const fs = require("fs");
    const path = require("path");
    const DATA_DIR = path.join(process.cwd(), "data");
    const filepath = path.join(DATA_DIR, filename);
    const obj = Object.fromEntries(data);
    fs.writeFileSync(filepath, JSON.stringify(obj, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error saving ${filename}:`, error);
  }
}

export const db = {
  users: {
    create: (user: UserProfile) => {
      users.set(user.id, user);
      saveData("users.json", users);
      return user;
    },
    findById: (id: string) => {
      return users.get(id) || null;
    },
    findByContact: (contact: string) => {
      return (
        Array.from(users.values()).find((u) => u.contact === contact) || null
      );
    },
    update: (id: string, updates: Partial<UserProfile>) => {
      const user = users.get(id);
      if (!user) return null;
      const updated = { ...user, ...updates };
      users.set(id, updated);
      saveData("users.json", users);
      return updated;
    },
    delete: (id: string) => {
      const result = users.delete(id);
      saveData("users.json", users);
      return result;
    },
    getAll: () => {
      return Array.from(users.values());
    },
  },
  travelAnnouncements: {
    create: (announcement: TravelAnnouncement) => {
      travelAnnouncements.set(announcement.id, announcement);
      saveData("travels.json", travelAnnouncements);
      return announcement;
    },
    findById: (id: string) => {
      return travelAnnouncements.get(id) || null;
    },
    findByGpId: (gpId: string) => {
      return Array.from(travelAnnouncements.values()).filter(
        (a) => a.gpId === gpId
      );
    },
    update: (id: string, updates: Partial<TravelAnnouncement>) => {
      const announcement = travelAnnouncements.get(id);
      if (!announcement) return null;
      const updated = {
        ...announcement,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      travelAnnouncements.set(id, updated);
      saveData("travels.json", travelAnnouncements);
      return updated;
    },
    delete: (id: string) => {
      const result = travelAnnouncements.delete(id);
      saveData("travels.json", travelAnnouncements);
      return result;
    },
    getAll: () => {
      return Array.from(travelAnnouncements.values());
    },
  },
  requestAnnouncements: {
    create: (announcement: RequestAnnouncement) => {
      requestAnnouncements.set(announcement.id, announcement);
      saveData("requests.json", requestAnnouncements);
      return announcement;
    },
    findById: (id: string) => {
      return requestAnnouncements.get(id) || null;
    },
    findByUserId: (userId: string) => {
      return Array.from(requestAnnouncements.values()).filter(
        (a) => a.userId === userId
      );
    },
    delete: (id: string) => {
      const result = requestAnnouncements.delete(id);
      saveData("requests.json", requestAnnouncements);
      return result;
    },
    getAll: () => {
      return Array.from(requestAnnouncements.values()).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  },
  conversations: {
    create: (conversation: Conversation) => {
      conversations.set(conversation.id, conversation);
      saveData("conversations.json", conversations);
      return conversation;
    },
    findById: (id: string) => {
      return conversations.get(id) || null;
    },
    findByUserId: (userId: string) => {
      return Array.from(conversations.values())
        .filter((c) => c.participants.some((p) => p.userId === userId))
        .sort((a, b) => {
          const aTime = a.lastMessageTime
            ? new Date(a.lastMessageTime).getTime()
            : new Date(a.createdAt).getTime();
          const bTime = b.lastMessageTime
            ? new Date(b.lastMessageTime).getTime()
            : new Date(b.createdAt).getTime();
          return bTime - aTime;
        });
    },
    update: (id: string, updates: Partial<Conversation>) => {
      const conversation = conversations.get(id);
      if (!conversation) return null;
      const updated = { ...conversation, ...updates };
      conversations.set(id, updated);
      saveData("conversations.json", conversations);
      return updated;
    },
    delete: (id: string) => {
      const result = conversations.delete(id);
      saveData("conversations.json", conversations);
      return result;
    },
    findExisting: (userId1: string, userId2: string) => {
      return (
        Array.from(conversations.values()).find(
          (c) =>
            c.participants.some((p) => p.userId === userId1) &&
            c.participants.some((p) => p.userId === userId2)
        ) || null
      );
    },
  },
  messages: {
    create: (message: Message) => {
      messages.set(message.id, message);
      saveData("messages.json", messages);
      return message;
    },
    findById: (id: string) => {
      return messages.get(id) || null;
    },
    findByConversationId: (conversationId: string) => {
      return Array.from(messages.values())
        .filter((m) => m.conversationId === conversationId)
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    },
    markAsRead: (id: string) => {
      const message = messages.get(id);
      if (!message) return null;
      const updated = { ...message, read: true };
      messages.set(id, updated);
      saveData("messages.json", messages);
      return updated;
    },
    markConversationAsRead: (conversationId: string, userId: string) => {
      const conversationMessages = Array.from(messages.values()).filter(
        (m) => m.conversationId === conversationId && m.senderId !== userId
      );
      conversationMessages.forEach((m) => {
        messages.set(m.id, { ...m, read: true });
      });
      saveData("messages.json", messages);
      return conversationMessages;
    },
  },
  shipments: {
    create: (shipment: Shipment) => {
      shipments.set(shipment.id, shipment);
      saveData("shipments.json", shipments);
      return shipment;
    },
    findById: (id: string) => {
      return shipments.get(id) || null;
    },
    findByUserId: (userId: string) => {
      return Array.from(shipments.values())
        .filter((s) => s.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },
    findByGpId: (gpId: string) => {
      return Array.from(shipments.values())
        .filter((s) => s.gpId === gpId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },
    findByRequestId: (requestId: string) => {
      return (
        Array.from(shipments.values()).find((s) => s.requestId === requestId) ||
        null
      );
    },
    update: (id: string, updates: Partial<Shipment>) => {
      const shipment = shipments.get(id);
      if (!shipment) return null;
      const updated = {
        ...shipment,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      shipments.set(id, updated);
      saveData("shipments.json", shipments);
      return updated;
    },
    delete: (id: string) => {
      const result = shipments.delete(id);
      saveData("shipments.json", shipments);
      return result;
    },
    getAll: () => {
      return Array.from(shipments.values()).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  },
};
