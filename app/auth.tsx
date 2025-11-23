import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LogIn, UserPlus, Phone, MapPin, User as UserIcon, Lock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { trpc, trpcClient } from '@/lib/trpc';

type AuthMode = 'login' | 'signup';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { saveUserProfile } = useUser();
  const [mode, setMode] = useState<AuthMode>('login');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);

  const createProfileMutation = trpc.users.createProfile.useMutation();

  const handleLogin = async () => {
    console.log('[Auth] Login attempt with contact:', contact);
    
    if (!contact.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const result = await trpcClient.users.login.query({ contact, password });
      console.log('[Auth] Login result:', result);
      
      if (result) {
        await saveUserProfile(result);
        Alert.alert('Connexion réussie', 'Bienvenue !', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        Alert.alert(
          'Compte introuvable',
          'Aucun compte trouvé avec ces informations. Voulez-vous créer un compte ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Créer un compte', onPress: () => setMode('signup') }
          ]
        );
      }
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
      
      if (error?.message?.includes('Mot de passe')) {
        Alert.alert('Erreur', 'Mot de passe incorrect');
      } else {
        Alert.alert(
          'Compte introuvable',
          'Aucun compte trouvé. Voulez-vous créer un compte ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Créer un compte', onPress: () => setMode('signup') }
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    console.log('[Auth] Signup attempt');
    
    if (!contact.trim() || !password.trim() || !firstName.trim() || !lastName.trim() || !country.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const newProfile = await createProfileMutation.mutateAsync({
        firstName,
        lastName,
        country,
        contact,
        password,
        isGP: false,
      });
      
      console.log('[Auth] Profile created:', newProfile);
      await saveUserProfile(newProfile);
      
      Alert.alert(
        'Compte créé',
        'Votre compte a été créé avec succès !',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error) {
      console.error('[Auth] Signup error:', error);
      Alert.alert('Erreur', 'Impossible de créer le compte. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#FF6B35', '#F7931E']}
          style={[styles.header, { paddingTop: insets.top + 40 }]}
        >
          <Text style={styles.logo}>GP Connect</Text>
          <Text style={styles.tagline}>Connecter l&apos;Afrique au monde</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'login' && styles.modeButtonActive]}
              onPress={() => setMode('login')}
            >
              <LogIn size={20} color={mode === 'login' ? '#FF6B35' : '#6C757D'} />
              <Text style={[styles.modeButtonText, mode === 'login' && styles.modeButtonTextActive]}>
                Connexion
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modeButton, mode === 'signup' && styles.modeButtonActive]}
              onPress={() => setMode('signup')}
            >
              <UserPlus size={20} color={mode === 'signup' ? '#FF6B35' : '#6C757D'} />
              <Text style={[styles.modeButtonText, mode === 'signup' && styles.modeButtonTextActive]}>
                Inscription
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Phone size={20} color="#FF6B35" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email ou Téléphone"
                value={contact}
                onChangeText={setContact}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Lock size={20} color="#FF6B35" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            {mode === 'signup' && (
              <>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <UserIcon size={20} color="#FF6B35" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Prénom"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <UserIcon size={20} color="#FF6B35" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Nom"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <MapPin size={20} color="#FF6B35" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Pays"
                    value={country}
                    onChangeText={setCountry}
                    placeholderTextColor="#999"
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={mode === 'login' ? handleLogin : handleSignup}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#CCC', '#AAA'] : ['#FF6B35', '#F7931E']}
                style={styles.submitButtonGradient}
              >
                {mode === 'login' ? (
                  <LogIn size={20} color="white" />
                ) : (
                  <UserPlus size={20} color="white" />
                )}
                <Text style={styles.submitButtonText}>
                  {loading
                    ? 'Chargement...'
                    : mode === 'login'
                    ? 'Se connecter'
                    : 'Créer un compte'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {mode === 'signup' && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  En créant un compte, vous pourrez publier des demandes d&apos;envoi de colis gratuitement.
                </Text>
              </View>
            )}

            {mode === 'login' && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Entrez votre email/téléphone et mot de passe pour vous connecter.
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.skipButtonText}>Continuer sans compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingBottom: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    marginTop: -40,
    paddingHorizontal: 20,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: '#FFF5F0',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C757D',
  },
  modeButtonTextActive: {
    color: '#FF6B35',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    overflow: 'hidden',
  },
  inputIconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF5F0',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2C3E50',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    fontSize: 13,
    color: '#2C3E50',
    lineHeight: 18,
  },
  skipButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
});
