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
import { useLanguage } from '@/contexts/LanguageContext';

export default function CreateGPProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createProfile, subscribeAsGp } = useUser();
  const { t } = useLanguage();
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
          t('createGPProfile.permissionRequired'),
          t('createGPProfile.permissionMessage')
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
      Alert.alert(t('createGPProfile.errorTitle'), t('createGPProfile.imageError'));
    }
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.country || !formData.contact || !formData.password) {
      Alert.alert(t('createGPProfile.errorTitle'), t('createGPProfile.errorAllFields'));
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
        t('createGPProfile.successTitle'),
        t('createGPProfile.successMessage'),
        [
          {
            text: t('common.ok'),
            onPress: () => router.replace('/(tabs)/profile'),
          },
        ]
      );
    } catch (error: any) {
      console.error('[CreateGPProfile] Error:', error);
      Alert.alert(
        t('createGPProfile.errorTitle'),
        error?.message || t('createGPProfile.errorMessage')
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
          <Text style={styles.headerTitle}>{t('createGPProfile.headerTitle')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('createGPProfile.headerSubtitle')}
          </Text>
        </LinearGradient>

        <View style={styles.content}>
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>{t('createGPProfile.profilePhoto')}</Text>
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
          <Text style={styles.imageHint}>{t('createGPProfile.photoHint')}</Text>
        </View>

        <View style={styles.infoCard}>
          <CheckCircle size={24} color="#4CAF50" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>{t('createGPProfile.infoTitle')}</Text>
            <Text style={styles.infoText}>
              {t('createGPProfile.infoText')}
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>{t('createGPProfile.personalInfo')}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('createGPProfile.firstName')} {t('createGPProfile.required')}</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('createGPProfile.firstNamePlaceholder')}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('createGPProfile.lastName')} {t('createGPProfile.required')}</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('createGPProfile.lastNamePlaceholder')}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('createGPProfile.country')} {t('createGPProfile.required')}</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('createGPProfile.countryPlaceholder')}
                value={formData.country}
                onChangeText={(text) => setFormData({ ...formData, country: text })}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('createGPProfile.contact')} {t('createGPProfile.required')}</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('createGPProfile.contactPlaceholder')}
                value={formData.contact}
                onChangeText={(text) => setFormData({ ...formData, contact: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('createGPProfile.password')} {t('createGPProfile.required')}</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color="#6C757D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t('createGPProfile.passwordPlaceholder')}
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
              <Text style={styles.submitButtonText}>{t('createGPProfile.createButton')}</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            {t('createGPProfile.disclaimer').split('conditions d\'utilisation')[0]}
            <Text style={styles.link} onPress={() => router.push('/terms')}>
              {t('createGPProfile.termsLink')}
            </Text>
            {t('createGPProfile.disclaimer').includes('et notre') && ' ' + t('createGPProfile.disclaimer').split('et notre')[1].split('politique de confidentialité')[0]}
            <Text style={styles.link} onPress={() => router.push('/privacy')}>
              {t('createGPProfile.privacyLink')}
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