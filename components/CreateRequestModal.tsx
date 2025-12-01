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
import { X, MapPin, Package, Calendar, MessageCircle, Box } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useRequests } from '@/contexts/RequestsContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreateRequestModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreateRequestModal({ visible, onClose }: CreateRequestModalProps) {
  const insets = useSafeAreaInsets();
  const { userProfile } = useUser();
  const { addRequest } = useRequests();
  const { t } = useLanguage();
  
  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [productType, setProductType] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handlePublishRequest = async () => {
    if (!fromCountry || !toCountry || !weight || !date || !productType || !contactInfo) {
      Alert.alert(t('createRequest.errorTitle'), t('createRequest.errorAllFields'));
      return;
    }

    if (!userProfile) {
      Alert.alert(t('createRequest.errorTitle'), t('createRequest.errorNoProfile'));
      return;
    }

    try {
      await addRequest({
        userId: userProfile.id,
        userName: `${userProfile.firstName} ${userProfile.lastName}`,
        fromCountry,
        toCountry,
        weight,
        date,
        productType,
        description: description || '',
        contactInfo,
      });
      
      setFromCountry('');
      setToCountry('');
      setWeight('');
      setDate('');
      setProductType('');
      setDescription('');
      setContactInfo('');
      
      Alert.alert(t('createRequest.successTitle'), t('createRequest.successMessage'));
      onClose();
    } catch (error) {
      console.error('Error creating request:', error);
      Alert.alert(t('createRequest.errorTitle'), t('createRequest.errorMessage'));
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
            <Text style={styles.modalTitle}>{t('createRequest.modalTitle')}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#2C3E50" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('createRequest.fromCountry')} {t('createRequest.required')}</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder={t('createRequest.fromPlaceholder')}
                  value={fromCountry}
                  onChangeText={setFromCountry}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('createRequest.toCountry')} {t('createRequest.required')}</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder={t('createRequest.toPlaceholder')}
                  value={toCountry}
                  onChangeText={setToCountry}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('createRequest.weight')} {t('createRequest.required')}</Text>
              <View style={styles.inputContainer}>
                <Package size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder={t('createRequest.weightPlaceholder')}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('createRequest.date')} {t('createRequest.required')}</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder={t('createRequest.datePlaceholder')}
                  value={date}
                  onChangeText={setDate}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('createRequest.productType')} {t('createRequest.required')}</Text>
              <View style={styles.inputContainer}>
                <Box size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder={t('createRequest.productTypePlaceholder')}
                  value={productType}
                  onChangeText={setProductType}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('createRequest.contact')} {t('createRequest.required')}</Text>
              <View style={styles.inputContainer}>
                <MessageCircle size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder={t('createRequest.contactPlaceholder')}
                  value={contactInfo}
                  onChangeText={setContactInfo}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('createRequest.description')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('createRequest.descriptionPlaceholder')}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={styles.publishButton}
              onPress={handlePublishRequest}
            >
              <Text style={styles.publishButtonText}>{t('createRequest.publishButton')}</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              {t('createRequest.disclaimer')}
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
  textArea: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    minHeight: 100,
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
});
