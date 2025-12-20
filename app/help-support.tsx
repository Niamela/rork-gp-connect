import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  MessageCircle, 
  Mail, 
  HelpCircle,
  Book,
  Video
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/contexts/LanguageContext';

const faqItems = [
  {
    question: 'Comment publier une demande d\'envoi ?',
    answer: 'Créez d\'abord un profil gratuit, puis cliquez sur le bouton + pour publier votre demande.',
  },
  {
    question: 'Comment devenir un GP ?',
    answer: 'Souscrivez à l\'abonnement mensuel de 10 000 F pour accéder à toutes les fonctionnalités GP.',
  },
  {
    question: 'Comment contacter un GP ?',
    answer: 'Seuls les GPs abonnés peuvent contacter les annonces. Abonnez-vous pour débloquer cette fonctionnalité.',
  },
  {
    question: 'Comment suivre mon colis ?',
    answer: 'Accédez à "Mes envois" dans votre profil pour suivre l\'état de vos colis en temps réel.',
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  const handleContactEmail = () => {
    Linking.openURL('mailto:support@gpconnect.com');
  };



  const handleLiveChat = () => {
    router.push('/contact');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t('helpSupport.title'),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color="#2C3E50" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('helpSupport.contactUs')}</Text>
          
          <TouchableOpacity style={styles.contactCard} onPress={handleLiveChat}>
            <View style={styles.contactIcon}>
              <MessageCircle size={24} color="#FF6B35" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>{t('helpSupport.liveChat')}</Text>
              <Text style={styles.contactDescription}>
                {t('helpSupport.liveChatDesc')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleContactEmail}>
            <View style={styles.contactIcon}>
              <Mail size={24} color="#FF6B35" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email</Text>
              <Text style={styles.contactDescription}>
                {t('helpSupport.emailDesc')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('helpSupport.faq')}</Text>
          
          {faqItems.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <View style={styles.faqQuestion}>
                <HelpCircle size={20} color="#FF6B35" />
                <Text style={styles.faqQuestionText}>{item.question}</Text>
              </View>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('helpSupport.resources')}</Text>
          
          <TouchableOpacity style={styles.resourceItem}>
            <Book size={20} color="#FF6B35" />
            <Text style={styles.resourceText}>{t('helpSupport.userGuide')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Video size={20} color="#FF6B35" />
            <Text style={styles.resourceText}>{t('helpSupport.videoTutorials')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {t('helpSupport.info')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: '#6C757D',
  },
  faqItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
    marginLeft: 32,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  resourceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  infoBox: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
});
