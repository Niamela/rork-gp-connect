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
import { trpc } from '@/lib/trpc';

interface CreateRequestModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreateRequestModal({ visible, onClose }: CreateRequestModalProps) {
  const insets = useSafeAreaInsets();
  const { userProfile } = useUser();
  
  const requestsQuery = trpc.requests.getAll.useQuery();
  const createRequestMutation = trpc.requests.create.useMutation();
  
  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [productType, setProductType] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handlePublishRequest = async () => {
    if (!fromCountry || !toCountry || !weight || !date || !productType || !contactInfo) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!userProfile) {
      Alert.alert('Erreur', 'Profil utilisateur introuvable');
      return;
    }

    try {
      await createRequestMutation.mutateAsync({
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

      await requestsQuery.refetch();
      
      setFromCountry('');
      setToCountry('');
      setWeight('');
      setDate('');
      setProductType('');
      setDescription('');
      setContactInfo('');
      
      Alert.alert('Succès', 'Votre demande a été publiée avec succès!');
      onClose();
    } catch (error) {
      console.error('Error creating request:', error);
      Alert.alert('Erreur', 'Impossible de publier la demande. Veuillez réessayer.');
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
            <Text style={styles.modalTitle}>Publier une demande</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#2C3E50" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>De (Pays) *</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Dubai"
                  value={fromCountry}
                  onChangeText={setFromCountry}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Vers (Pays) *</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Mali"
                  value={toCountry}
                  onChangeText={setToCountry}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Poids approximatif (kg) *</Text>
              <View style={styles.inputContainer}>
                <Package size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 15"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date souhaitée *</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 25 Jan 2025"
                  value={date}
                  onChangeText={setDate}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Type de produit *</Text>
              <View style={styles.inputContainer}>
                <Box size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Vêtements, Électronique, Documents..."
                  value={productType}
                  onChangeText={setProductType}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Contact (Téléphone ou Email) *</Text>
              <View style={styles.inputContainer}>
                <MessageCircle size={20} color="#FF6B35" />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: +223 XX XX XX XX"
                  value={contactInfo}
                  onChangeText={setContactInfo}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (optionnel)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Décrivez votre colis et vos besoins..."
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
              <Text style={styles.publishButtonText}>Publier la demande</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              * Champs obligatoires. Votre demande sera visible par tous les GPs.
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
