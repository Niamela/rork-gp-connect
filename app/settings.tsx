import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Globe, 
  Moon, 
  Shield, 
  Trash2,
  Download,
  Lock
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTravels } from '@/contexts/TravelsContext';
import { useRequests } from '@/contexts/RequestsContext';
import { useMessages } from '@/contexts/MessagesContext';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { clearUserProfile } = useUser();
  const { language, changeLanguage, t } = useLanguage();
  const { clearAllTravels } = useTravels();
  const { clearAllRequests } = useRequests();
  const { clearAllMessages } = useMessages();
  
  const [darkMode, setDarkMode] = useState(false);
  const [autoDownload, setAutoDownload] = useState(true);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await clearUserProfile();
            Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Vider le cache',
      'Êtes-vous sûr de vouloir vider le cache de l&apos;application ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Vider',
          onPress: () => {
            Alert.alert('Cache vidé', 'Le cache a été vidé avec succès');
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      language === 'fr' ? 'Supprimer toutes les données' : 'Delete All Data',
      language === 'fr' 
        ? 'Êtes-vous sûr de vouloir supprimer toutes les annonces, demandes et messages ? Cette action est irréversible.'
        : 'Are you sure you want to delete all announcements, requests and messages? This action is irreversible.',
      [
        { text: language === 'fr' ? 'Annuler' : 'Cancel', style: 'cancel' },
        {
          text: language === 'fr' ? 'Supprimer tout' : 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllTravels();
              await clearAllRequests();
              await clearAllMessages();
              Alert.alert(
                language === 'fr' ? 'Données supprimées' : 'Data Deleted',
                language === 'fr' 
                  ? 'Toutes les données de test ont été supprimées avec succès'
                  : 'All test data has been successfully deleted'
              );
            } catch {
              Alert.alert(
                'Erreur',
                language === 'fr'
                  ? 'Une erreur est survenue lors de la suppression des données'
                  : 'An error occurred while deleting data'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t('settings.title'),
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
          <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Moon size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('settings.darkMode')}</Text>
                <Text style={styles.settingDescription}>
                  {t('settings.darkModeDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E9ECEF', true: '#FF6B35' }}
              thumbColor="white"
            />
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              const newLang = language === 'fr' ? 'en' : 'fr';
              changeLanguage(newLang);
            }}
          >
            <View style={styles.settingLeft}>
              <Globe size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('settings.language')}</Text>
                <Text style={styles.settingDescription}>
                  {language === 'fr' ? t('settings.languageFrench') : t('settings.languageEnglish')}
                </Text>
              </View>
            </View>
            <View style={styles.languageBadge}>
              <Text style={styles.languageBadgeText}>{language.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.dataStorage')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Download size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('settings.autoDownload')}</Text>
                <Text style={styles.settingDescription}>
                  {t('settings.autoDownloadDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={autoDownload}
              onValueChange={setAutoDownload}
              trackColor={{ false: '#E9ECEF', true: '#FF6B35' }}
              thumbColor="white"
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
            <View style={styles.settingLeft}>
              <Trash2 size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('settings.clearCache')}</Text>
                <Text style={styles.settingDescription}>
                  {t('settings.clearCacheDesc')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.privacySecurity')}</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/privacy')}
          >
            <View style={styles.settingLeft}>
              <Shield size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('settings.privacyPolicy')}</Text>
                <Text style={styles.settingDescription}>
                  {t('settings.privacyPolicyDesc')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Lock size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('settings.accountSecurity')}</Text>
                <Text style={styles.settingDescription}>
                  {t('settings.accountSecurityDesc')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.dangerZone')}</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleClearAllData}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={20} color="#FF9800" />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: '#FF9800' }]}>
                  {language === 'fr' ? 'Supprimer toutes les données de test' : 'Delete All Test Data'}
                </Text>
                <Text style={styles.settingDescription}>
                  {language === 'fr' 
                    ? 'Supprimer toutes les annonces, demandes et messages'
                    : 'Delete all announcements, requests and messages'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={20} color="#DC3545" />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, styles.dangerText]}>
                  {t('settings.deleteAccount')}
                </Text>
                <Text style={styles.settingDescription}>
                  {t('settings.deleteAccountDesc')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {t('settings.deleteWarning')}
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
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#DC3545',
  },
  languageBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  languageBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC3545',
  },
  infoText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
});
