import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Bell, MessageSquare, Package, Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [newRequestsEnabled, setNewRequestsEnabled] = useState(true);
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [shipmentsEnabled, setShipmentsEnabled] = useState(true);
  const [reviewsEnabled, setReviewsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t('notifications.title'),
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
          <Text style={styles.sectionTitle}>{t('notifications.channels')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('notifications.push')}</Text>
                <Text style={styles.settingDescription}>
                  {t('notifications.pushDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#E9ECEF', true: '#FF6B35' }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('notifications.email')}</Text>
                <Text style={styles.settingDescription}>
                  {t('notifications.emailDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: '#E9ECEF', true: '#FF6B35' }}
              thumbColor="white"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notifications.types')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MessageSquare size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('notifications.newRequests')}</Text>
                <Text style={styles.settingDescription}>
                  {t('notifications.newRequestsDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={newRequestsEnabled}
              onValueChange={setNewRequestsEnabled}
              trackColor={{ false: '#E9ECEF', true: '#FF6B35' }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MessageSquare size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('notifications.messages')}</Text>
                <Text style={styles.settingDescription}>
                  {t('notifications.messagesDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={messagesEnabled}
              onValueChange={setMessagesEnabled}
              trackColor={{ false: '#E9ECEF', true: '#FF6B35' }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Package size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('notifications.shipmentTracking')}</Text>
                <Text style={styles.settingDescription}>
                  {t('notifications.shipmentTrackingDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={shipmentsEnabled}
              onValueChange={setShipmentsEnabled}
              trackColor={{ false: '#E9ECEF', true: '#FF6B35' }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Star size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('notifications.reviews')}</Text>
                <Text style={styles.settingDescription}>
                  {t('notifications.reviewsDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={reviewsEnabled}
              onValueChange={setReviewsEnabled}
              trackColor={{ false: '#E9ECEF', true: '#FF6B35' }}
              thumbColor="white"
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {t('notifications.info')}
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
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6C757D',
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
