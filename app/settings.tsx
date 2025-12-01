import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Globe, 
  Moon, 
  Shield, 
  Trash2,
  Download,
  Lock,
  X
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { clearUserProfile } = useUser();
  const { language, changeLanguage, t } = useLanguage();
  const { theme, setThemeMode, colors } = useTheme();
  
  const [autoDownload, setAutoDownload] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  const isDarkMode = theme === 'dark';
  
  const toggleDarkMode = async (value: boolean) => {
    await setThemeMode(value ? 'dark' : 'light');
  };

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.appearance')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Moon size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{t('settings.darkMode')}</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {t('settings.darkModeDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#E9ECEF', true: '#FF6B35' }}
              thumbColor="white"
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={() => setShowLanguageModal(true)}>
            <View style={styles.settingLeft}>
              <Globe size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{t('settings.language')}</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {language === 'fr' ? t('settings.languageFr') : t('settings.languageEn')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.dataStorage')}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Download size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{t('settings.autoDownload')}</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
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
                <Text style={[styles.settingTitle, { color: colors.text }]}>{t('settings.clearCache')}</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {t('settings.clearCacheDesc')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.privacySecurity')}</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/privacy')}
          >
            <View style={styles.settingLeft}>
              <Shield size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{t('settings.privacyPolicy')}</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {t('settings.privacyPolicyDesc')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Lock size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{t('settings.accountSecurity')}</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {t('settings.accountSecurityDesc')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.dangerZone')}</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={20} color="#DC3545" />
              <View style={styles.settingText}>
                <Text style={styles.dangerText}>
                  {t('settings.deleteAccount')}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {t('settings.deleteAccountDesc')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.background }]}>
          <Text style={[styles.infoText, { color: colors.text }]}>
            {t('settings.deleteAccountWarning')}
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('settings.language')}</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'fr' && { backgroundColor: colors.inputBackground },
                { borderBottomColor: colors.border },
              ]}
              onPress={async () => {
                await changeLanguage('fr');
                setShowLanguageModal(false);
              }}
            >
              <View style={styles.languageOptionContent}>
                <Text style={[
                  { color: colors.text },
                  language === 'fr' && styles.languageOptionTextActive,
                ]}>
                  Français
                </Text>
                {language === 'fr' && (
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkIconText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'en' && { backgroundColor: colors.inputBackground },
                { borderBottomColor: colors.border },
              ]}
              onPress={async () => {
                await changeLanguage('en');
                setShowLanguageModal(false);
              }}
            >
              <View style={styles.languageOptionContent}>
                <Text style={[
                  { color: colors.text },
                  language === 'en' && styles.languageOptionTextActive,
                ]}>
                  English
                </Text>
                {language === 'en' && (
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkIconText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: '85%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  languageOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  languageOptionActive: {
    backgroundColor: '#FFF5F0',
  },
  languageOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  languageOptionTextActive: {
    fontWeight: '600',
    color: '#FF6B35',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
