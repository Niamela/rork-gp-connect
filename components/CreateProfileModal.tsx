import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { X, User, MapPin, MessageCircle, CheckCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreateProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateProfileModal({ visible, onClose, onSuccess }: CreateProfileModalProps) {
  const insets = useSafeAreaInsets();
  const { createProfile } = useUser();
  const { t } = useLanguage();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [contact, setContact] = useState('');

  const handleCreateProfile = async () => {
    if (!firstName || !lastName || !country || !contact) {
      Alert.alert(t('createProfile.errorTitle'), t('createProfile.errorAllFields'));
      return;
    }

    try {
      await createProfile({
        firstName,
        lastName,
        country,
        contact,
        password: 'default123',
        isGP: false,
      });
      
      setFirstName('');
      setLastName('');
      setCountry('');
      setContact('');
      
      Alert.alert(
        t('createProfile.successTitle'),
        t('createProfile.successMessage'),
        [{ text: t('common.ok'), onPress: () => {
          onClose();
          if (onSuccess) onSuccess();
        }}]
      );
    } catch {
      Alert.alert(t('createProfile.errorTitle'), t('createProfile.errorMessage'));
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('createProfile.modalTitle')}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#2C3E50" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.profileInfoCard}>
              <Text style={styles.profileInfoText}>
                {t('createProfile.infoText')}
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('createProfile.firstName')} {t('createProfile.required')}</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder={t('createProfile.firstNamePlaceholder')}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('createProfile.lastName')} {t('createProfile.required')}</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder={t('createProfile.lastNamePlaceholder')}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('createProfile.country')} {t('createProfile.required')}</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder={t('createProfile.countryPlaceholder')}
                  value={country}
                  onChangeText={setCountry}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('createProfile.contact')} {t('createProfile.required')}</Text>
              <View style={styles.inputContainer}>
                <MessageCircle size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder={t('createProfile.contactPlaceholder')}
                  value={contact}
                  onChangeText={setContact}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.verificationNote}>
              <CheckCircle size={16} color="#28A745" />
              <Text style={styles.verificationText}>
                {t('createProfile.verificationNote')}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.publishButton}
              onPress={handleCreateProfile}
            >
              <Text style={styles.publishButtonText}>{t('createProfile.createButton')}</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              {t('createProfile.disclaimer')}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  formGroup: {
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
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  publishButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  publishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileInfoCard: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  profileInfoText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  verificationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  verificationText: {
    flex: 1,
    fontSize: 12,
    color: '#28A745',
  },
});
