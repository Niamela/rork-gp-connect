import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, MapPin, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { trpc } from '@/lib/trpc';
import { useUser } from '@/contexts/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateGPProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { saveUserProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    email: '',
    password: '',
  });

  const createProfileMutation = trpc.users.createProfile.useMutation();
  const subscribeGpMutation = trpc.users.subscribeGp.useMutation();

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.country || !formData.email || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      console.log('[CreateGPProfile] Creating profile with data:', formData);
      
      const profile = await createProfileMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        email: formData.email,
        password: formData.password,
        isGP: true,
      });

      console.log('[CreateGPProfile] Profile created:', profile);

      console.log('[CreateGPProfile] Subscribing to GP...');
      const updatedProfile = await subscribeGpMutation.mutateAsync({ userId: profile.id });
      console.log('[CreateGPProfile] GP subscription successful');

      if (updatedProfile) {
        await saveUserProfile(updatedProfile);
      }

      Alert.alert(
        'Succès',
        'Votre profil GP a été créé avec succès! Vous pouvez maintenant publier vos voyages.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/profile'),
          },
        ]
      );
    } catch (error: any) {
      console.error('[CreateGPProfile] Error:', error);
      Alert.alert(
        'Erreur',
        error?.message || 'Une erreur est survenue lors de la création du profil'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#4CAF50', '#45A049']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Devenir GP</Text>
          <Text style={styles.headerSubtitle}>
            Créez votre profil et commencez à publier vos voyages
          </Text>
        </LinearGradient>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <CheckCircle size={24} color="#4CAF50" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Abonnement mensuel: 10 000 F</Text>
            <Text style={styles.infoText}>
              Publiez autant de voyages que vous souhaitez et recevez des demandes de particuliers
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prénom *</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Entrez votre prénom"
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom *</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Entrez votre nom"
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pays *</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Entrez votre pays"
                value={formData.country}
                onChangeText={(text) => setFormData({ ...formData, country: text })}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe *</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Au moins 6 caractères"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Créer mon profil GP</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            En créant un profil GP, vous acceptez nos{' '}
            <Text style={styles.link} onPress={() => router.push('/terms')}>
              conditions d&apos;utilisation
            </Text>
            {' '}et notre{' '}
            <Text style={styles.link} onPress={() => router.push('/privacy')}>
              politique de confidentialité
            </Text>
            .
          </Text>
        </View>
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
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});