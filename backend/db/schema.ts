import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  country: z.string().min(1, 'Le pays est requis'),
  contact: z.string().min(1, 'Le contact est requis'),
  isVerified: z.boolean().default(false),
  createdAt: z.string(),
  isGP: z.boolean().default(false),
  gpSubscription: z.object({
    isActive: z.boolean(),
    startDate: z.string(),
    endDate: z.string(),
    amount: z.number(),
  }).optional(),
});

export const TravelAnnouncementSchema = z.object({
  id: z.string(),
  gpId: z.string(),
  fromCountry: z.string().min(1, 'Le pays de départ est requis'),
  toCountry: z.string().min(1, 'Le pays de destination est requis'),
  departureDate: z.string().min(1, 'La date de départ est requise'),
  maxWeight: z.string().min(1, 'Le poids maximum est requis'),
  pricePerKg: z.string().min(1, 'Le prix par kg est requis'),
  availableSpace: z.string().min(1, "L'espace disponible est requis"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const RequestAnnouncementSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  fromCountry: z.string().min(1, 'Le pays de départ est requis'),
  toCountry: z.string().min(1, 'Le pays de destination est requis'),
  weight: z.string().min(1, 'Le poids est requis'),
  date: z.string().min(1, 'La date est requise'),
  productType: z.string().min(1, 'Le type de produit est requis'),
  description: z.string().optional(),
  contactInfo: z.string().min(1, 'Les informations de contact sont requises'),
  postedDate: z.string(),
  createdAt: z.string(),
});

export const CreateUserProfileSchema = UserProfileSchema.omit({ id: true, createdAt: true, isVerified: true });
export const UpdateUserProfileSchema = UserProfileSchema.partial().omit({ id: true, createdAt: true });

export const CreateTravelAnnouncementSchema = TravelAnnouncementSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const UpdateTravelAnnouncementSchema = TravelAnnouncementSchema.partial().omit({ id: true, gpId: true, createdAt: true });

export const CreateRequestAnnouncementSchema = RequestAnnouncementSchema.omit({ id: true, postedDate: true, createdAt: true });

export const ConversationSchema = z.object({
  id: z.string(),
  participants: z.array(z.object({
    userId: z.string(),
    userName: z.string(),
    isGP: z.boolean(),
  })),
  lastMessage: z.string().optional(),
  lastMessageTime: z.string().optional(),
  createdAt: z.string(),
  requestId: z.string().optional(),
  travelId: z.string().optional(),
});

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  content: z.string(),
  timestamp: z.string(),
  read: z.boolean().default(false),
});

export const CreateConversationSchema = z.object({
  otherUserId: z.string(),
  otherUserName: z.string(),
  otherUserIsGP: z.boolean(),
  requestId: z.string().optional(),
  travelId: z.string().optional(),
});

export const SendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
export type TravelAnnouncement = z.infer<typeof TravelAnnouncementSchema>;
export type RequestAnnouncement = z.infer<typeof RequestAnnouncementSchema>;
export type CreateUserProfile = z.infer<typeof CreateUserProfileSchema>;
export type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;
export type CreateTravelAnnouncement = z.infer<typeof CreateTravelAnnouncementSchema>;
export type UpdateTravelAnnouncement = z.infer<typeof UpdateTravelAnnouncementSchema>;
export type CreateRequestAnnouncement = z.infer<typeof CreateRequestAnnouncementSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type CreateConversation = z.infer<typeof CreateConversationSchema>;
export type SendMessage = z.infer<typeof SendMessageSchema>;
