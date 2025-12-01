import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Conversation {
  id: string;
  participants: {
    userId: string;
    userName: string;
    isGP: boolean;
  }[];
  lastMessage?: string;
  lastMessageTime?: string;
  createdAt: string;
  requestId?: string;
  travelId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const CONVERSATIONS_STORAGE_KEY = '@gp_connect_conversations';
const MESSAGES_STORAGE_KEY = '@gp_connect_messages';

export const [MessagesProvider, useMessages] = createContextHook(() => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    console.log('[MessagesContext] Loading conversations...');
    setIsLoading(true);
    try {
      const stored = await AsyncStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      if (stored) {
        const parsedConversations = JSON.parse(stored);
        console.log('[MessagesContext] Conversations loaded:', parsedConversations);
        setConversations(parsedConversations);
      }
    } catch (error) {
      console.error('[MessagesContext] Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    console.log('[MessagesContext] Loading messages...');
    try {
      const stored = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
      if (stored) {
        const parsedMessages = JSON.parse(stored);
        console.log('[MessagesContext] Messages loaded:', parsedMessages);
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error('[MessagesContext] Error loading messages:', error);
    }
  }, []);

  useEffect(() => {
    loadConversations();
    loadMessages();
  }, [loadConversations, loadMessages]);

  const saveConversations = useCallback(async (newConversations: Conversation[]) => {
    try {
      await AsyncStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(newConversations));
      setConversations(newConversations);
      console.log('[MessagesContext] Conversations saved successfully');
    } catch (error) {
      console.error('[MessagesContext] Error saving conversations:', error);
      throw error;
    }
  }, []);

  const saveMessages = useCallback(async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(newMessages));
      setMessages(newMessages);
      console.log('[MessagesContext] Messages saved successfully');
    } catch (error) {
      console.error('[MessagesContext] Error saving messages:', error);
      throw error;
    }
  }, []);

  const getConversationsByUserId = useCallback((userId: string) => {
    return conversations.filter(conv => 
      conv.participants.some(p => p.userId === userId)
    );
  }, [conversations]);

  const getMessagesByConversationId = useCallback((conversationId: string) => {
    return messages.filter(msg => msg.conversationId === conversationId);
  }, [messages]);

  const createConversation = useCallback(async (data: {
    userId: string;
    otherUserId: string;
    otherUserName: string;
    otherUserIsGP: boolean;
    requestId?: string;
    travelId?: string;
  }) => {
    const existingConv = conversations.find(conv => 
      conv.participants.some(p => p.userId === data.userId) &&
      conv.participants.some(p => p.userId === data.otherUserId)
    );

    if (existingConv) {
      return existingConv;
    }

    const newConversation: Conversation = {
      id: Date.now().toString(),
      participants: [
        { userId: data.userId, userName: 'Me', isGP: false },
        { userId: data.otherUserId, userName: data.otherUserName, isGP: data.otherUserIsGP }
      ],
      createdAt: new Date().toISOString(),
      requestId: data.requestId,
      travelId: data.travelId,
    };

    const updated = [...conversations, newConversation];
    await saveConversations(updated);
    return newConversation;
  }, [conversations, saveConversations]);

  const sendMessage = useCallback(async (data: {
    conversationId: string;
    content: string;
    userId: string;
  }) => {
    const conversation = conversations.find(c => c.id === data.conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const sender = conversation.participants.find(p => p.userId === data.userId);
    if (!sender) throw new Error('Sender not found in conversation');

    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: data.conversationId,
      senderId: data.userId,
      senderName: sender.userName,
      content: data.content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedMessages = [...messages, newMessage];
    await saveMessages(updatedMessages);

    const updatedConversations = conversations.map(conv =>
      conv.id === data.conversationId
        ? {
            ...conv,
            lastMessage: data.content,
            lastMessageTime: new Date().toISOString(),
          }
        : conv
    );
    await saveConversations(updatedConversations);

    return newMessage;
  }, [messages, conversations, saveMessages, saveConversations]);

  const markAsRead = useCallback(async (conversationId: string, userId: string) => {
    const updatedMessages = messages.map(msg =>
      msg.conversationId === conversationId && msg.senderId !== userId
        ? { ...msg, read: true }
        : msg
    );
    await saveMessages(updatedMessages);
  }, [messages, saveMessages]);

  return useMemo(() => ({
    conversations,
    messages,
    isLoading,
    getConversationsByUserId,
    getMessagesByConversationId,
    createConversation,
    sendMessage,
    markAsRead,
    refetch: () => {
      loadConversations();
      loadMessages();
    },
  }), [conversations, messages, isLoading, getConversationsByUserId, getMessagesByConversationId, createConversation, sendMessage, markAsRead, loadConversations, loadMessages]);
});
