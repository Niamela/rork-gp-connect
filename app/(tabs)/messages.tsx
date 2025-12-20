import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MessageCircle, Send, ArrowLeft, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useMessages } from '@/contexts/MessagesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Conversation } from '@/contexts/MessagesContext';
import { useRouter } from 'expo-router';



export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { userProfile } = useUser();
  const router = useRouter();
  const { t } = useLanguage();
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const { 
    getConversationsByUserId, 
    getMessagesByConversationId, 
    sendMessage: sendMessageToConversation,
    markAsRead,
    isLoading
  } = useMessages();

  const conversations = userProfile?.id ? getConversationsByUserId(userProfile.id) : [];
  const messages = selectedConversation?.id ? getMessagesByConversationId(selectedConversation.id) : [];

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (userProfile?.id) {
      await markAsRead(conversation.id, userProfile.id);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !userProfile?.id) return;

    try {
      await sendMessageToConversation({
        conversationId: selectedConversation.id,
        content: messageInput.trim(),
        userId: userProfile.id,
      });
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.userId !== userProfile?.id);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return t('messages.yesterday');
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  if (!userProfile) {
    return (
      <View style={[styles.container, styles.emptyState]}>
        <MessageCircle size={64} color="#CCC" />
        <Text style={styles.emptyTitle}>{t('messages.title')}</Text>
        <Text style={styles.emptyText}>
          {t('messages.loginRequired')}
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/create-gp-profile')}
        >
          <Text style={styles.loginButtonText}>{t('messages.createProfile')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (selectedConversation) {
    const otherParticipant = getOtherParticipant(selectedConversation);
    
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={[styles.chatHeader, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            onPress={() => setSelectedConversation(null)}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#2C3E50" />
          </TouchableOpacity>
          <View style={styles.chatHeaderAvatar}>
            <User size={20} color="#FF6B35" />
          </View>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderName}>{otherParticipant?.userName || 'Utilisateur'}</Text>
            <Text style={styles.chatHeaderStatus}>
              {otherParticipant?.isGP ? t('browse.grandPassenger') : t('messages.individual')}
            </Text>
          </View>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContent}
          renderItem={({ item }) => {
            const isMyMessage = item.senderId === userProfile?.id;
            return (
              <View
                style={[
                  styles.messageBubble,
                  isMyMessage ? styles.myMessage : styles.theirMessage,
                ]}
              >
                {!isMyMessage && (
                  <Text style={styles.senderName}>{item.senderName}</Text>
                )}
                <Text style={[styles.messageText, isMyMessage && { color: 'white' }, !isMyMessage && { color: '#2C3E50' }]}>{item.content}</Text>
                <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
              </View>
            );
          }}
        />

        <View style={[styles.messageInputContainer, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            style={styles.messageInput}
            placeholder={t('messages.writeMessage')}
            value={messageInput}
            onChangeText={setMessageInput}
            multiline
            maxLength={500}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !messageInput.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!messageInput.trim()}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>{t('messages.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('messages.subtitle')}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{t('browse.loading')}</Text>
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.emptyState}>
          <MessageCircle size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>{t('messages.noMessages')}</Text>
          <Text style={styles.emptyText}>
            {t('messages.noMessagesText')}
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {conversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            return (
              <TouchableOpacity
                key={conversation.id}
                style={styles.conversationCard}
                onPress={() => handleSelectConversation(conversation)}
              >
                <View style={styles.conversationAvatar}>
                  <User size={20} color="#FF6B35" />
                </View>
                <View style={styles.conversationInfo}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.conversationName}>
                      {otherParticipant?.userName || 'Utilisateur'}
                    </Text>
                    {conversation.lastMessageTime && (
                      <Text style={styles.conversationTime}>
                        {formatTime(conversation.lastMessageTime)}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.conversationType}>
                    {otherParticipant?.isGP ? t('browse.grandPassenger') : t('messages.individual')}
                  </Text>
                  {conversation.lastMessage && (
                    <Text style={styles.lastMessage} numberOfLines={1}>
                      {conversation.lastMessage}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6C757D',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  conversationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  conversationAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  conversationTime: {
    fontSize: 12,
    color: '#6C757D',
  },
  conversationType: {
    fontSize: 12,
    color: '#FF6B35',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6C757D',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
  },
  loginButton: {
    marginTop: 24,
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#FF6B35',
  },
  messagesContent: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B35',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    color: '#2C3E50',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
