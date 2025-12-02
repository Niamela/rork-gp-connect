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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Phone, MapPin, CheckCircle, Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/contexts/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function CreateGPProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createProfile, subscribeAsGp } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    contact: '',
    password: '',
  });
  const [profileImageUri, setProfileImageUri] = useState('');

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Veuillez autoriser l\'accès à la galerie pour sélectionner une photo'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.country || !formData.contact || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      console.log('[CreateGPProfile] Creating profile with data:', formData);
      
      await createProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        contact: formData.contact,
        password: formData.password,
        isGP: false,
        profileImageUri: profileImageUri || undefined,
      });

      console.log('[CreateGPProfile] Subscribing to GP...');
      await subscribeAsGp();
      console.log('[CreateGPProfile] GP subscription successful');

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
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Photo de profil</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Camera size={40} color="#6C757D" />
              </View>
            )}
            <View style={styles.cameraIconOverlay}>
              <Camera size={20} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageHint}>Photo qui apparaîtra dans vos annonces</Text>
        </View>

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
            <Text style={styles.label}>Contact (Téléphone) *</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="+225 XX XX XX XX XX"
                value={formData.contact}
                onChangeText={(text) => setFormData({ ...formData, contact: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe *</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe (min. 6 caractères)"
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
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  cameraIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  imageHint: {
    fontSize: 13,
    color: '#6C757D',
    textAlign: 'center',
  },
});