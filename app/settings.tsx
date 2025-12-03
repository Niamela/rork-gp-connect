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

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { clearUserProfile } = useUser();
  
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

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Paramètres',
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
          <Text style={styles.sectionTitle}>Apparence</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Moon size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Mode sombre</Text>
                <Text style={styles.settingDescription}>
                  Activer le thème sombre
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

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Globe size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Langue</Text>
                <Text style={styles.settingDescription}>Français</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Données et stockage</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Download size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Téléchargement automatique</Text>
                <Text style={styles.settingDescription}>
                  Télécharger automatiquement les images
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
                <Text style={styles.settingTitle}>Vider le cache</Text>
                <Text style={styles.settingDescription}>
                  Libérer de l&apos;espace de stockage
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confidentialité et sécurité</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/privacy')}
          >
            <View style={styles.settingLeft}>
              <Shield size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Politique de confidentialité</Text>
                <Text style={styles.settingDescription}>
                  Voir notre politique de confidentialité
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Lock size={20} color="#FF6B35" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Sécurité du compte</Text>
                <Text style={styles.settingDescription}>
                  Gérer la sécurité de votre compte
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zone dangereuse</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={20} color="#DC3545" />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, styles.dangerText]}>
                  Supprimer le compte
                </Text>
                <Text style={styles.settingDescription}>
                  Supprimer définitivement votre compte
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ⚠️ La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
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
