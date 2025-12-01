import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  Edit2,
  Trash2,
  X,
  Plane,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';

export default function GPTravelsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userProfile, addTravelAnnouncement, updateTravelAnnouncement, deleteTravelAnnouncement } = useUser();
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fromCountry: '',
    toCountry: '',
    departureDate: '',
    maxWeight: '',
    pricePerKg: '',
    availableSpace: '',
  });

  const isGPSubscribed = userProfile?.isGP && userProfile?.gpSubscription?.isActive;
  
  const travelAnnouncements = userProfile?.gpTravelAnnouncements || [];

  const resetForm = () => {
    setFormData({
      fromCountry: '',
      toCountry: '',
      departureDate: '',
      maxWeight: '',
      pricePerKg: '',
      availableSpace: '',
    });
    setEditingId(null);
  };

  const handleOpenModal = (announcement?: any) => {
    if (announcement) {
      setFormData({
        fromCountry: announcement.fromCountry,
        toCountry: announcement.toCountry,
        departureDate: announcement.departureDate,
        maxWeight: announcement.maxWeight,
        pricePerKg: announcement.pricePerKg,
        availableSpace: announcement.availableSpace,
      });
      setEditingId(announcement.id);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSave = async () => {
    if (!formData.fromCountry || !formData.toCountry || !formData.departureDate) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!userProfile) {
      Alert.alert('Erreur', 'Profil utilisateur non trouvé.');
      return;
    }

    try {
      if (editingId) {
        await updateTravelAnnouncement(editingId, formData);
        Alert.alert('Succès', 'Annonce de voyage mise à jour avec succès.');
      } else {
        await addTravelAnnouncement({
          gpId: userProfile.id,
          ...formData,
        });
        Alert.alert('Succès', 'Annonce de voyage ajoutée avec succès.');
      }
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving travel announcement:', error);
      Alert.alert('Erreur', error?.message || 'Une erreur est survenue lors de l\'enregistrement.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette annonce de voyage ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTravelAnnouncement(id);
              Alert.alert('Succès', 'Annonce de voyage supprimée avec succès.');
            } catch (error: any) {
              console.error('Error deleting travel announcement:', error);
              Alert.alert('Erreur', error?.message || 'Une erreur est survenue lors de la suppression.');
            }
          },
        },
      ]
    );
  };

  if (!isGPSubscribed) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Mes Voyages',
            headerStyle: { backgroundColor: '#FF6B35' },
            headerTintColor: 'white',
          }}
        />
        <View style={styles.notSubscribedContainer}>
          <Plane size={64} color="#6C757D" />
          <Text style={styles.notSubscribedTitle}>Abonnement requis</Text>
          <Text style={styles.notSubscribedText}>
            Vous devez être abonné en tant que GP pour gérer vos annonces de voyage.
          </Text>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.subscribeButtonText}>Retour au profil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Mes Voyages',
          headerStyle: { backgroundColor: '#FF6B35' },
          headerTintColor: 'white',
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#FF6B35', '#F7931E']}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <Text style={styles.headerTitle}>Gérer mes voyages</Text>
          <Text style={styles.headerSubtitle}>
            Ajoutez et mettez à jour vos destinations de voyage
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleOpenModal()}
          >
            <Plus size={24} color="white" />
            <Text style={styles.addButtonText}>Ajouter un voyage</Text>
          </TouchableOpacity>

          {travelAnnouncements.length === 0 ? (
            <View style={styles.emptyState}>
              <Plane size={48} color="#6C757D" />
              <Text style={styles.emptyStateTitle}>Aucun voyage</Text>
              <Text style={styles.emptyStateText}>
                Commencez par ajouter votre première annonce de voyage
              </Text>
            </View>
          ) : (
            <View style={styles.announcementsList}>
              {travelAnnouncements.map((announcement) => (
                <View key={announcement.id} style={styles.announcementCard}>
                  <View style={styles.announcementHeader}>
                    <View style={styles.routeContainer}>
                      <MapPin size={16} color="#FF6B35" />
                      <Text style={styles.routeText}>
                        {announcement.fromCountry} → {announcement.toCountry}
                      </Text>
                    </View>
                    <View style={styles.announcementActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleOpenModal(announcement)}
                      >
                        <Edit2 size={18} color="#007AFF" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDelete(announcement.id)}
                      >
                        <Trash2 size={18} color="#DC3545" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.announcementDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={14} color="#6C757D" />
                      <Text style={styles.detailText}>
                        Départ: {announcement.departureDate}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Package size={14} color="#6C757D" />
                      <Text style={styles.detailText}>
                        Max: {announcement.maxWeight} kg
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <DollarSign size={14} color="#6C757D" />
                      <Text style={styles.detailText}>
                        {announcement.pricePerKg} F/kg
                      </Text>
                    </View>
                    {announcement.availableSpace && (
                      <View style={styles.detailRow}>
                        <Package size={14} color="#6C757D" />
                        <Text style={styles.detailText}>
                          Espace: {announcement.availableSpace}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.updatedText}>
                    Mis à jour: {new Date(announcement.updatedAt).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Modifier le voyage' : 'Nouveau voyage'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <X size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Pays de départ *</Text>
                  <View style={styles.inputContainer}>
                    <MapPin size={20} color="#FF6B35" />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: Mali"
                      value={formData.fromCountry}
                      onChangeText={(text) => setFormData({ ...formData, fromCountry: text })}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Pays de destination *</Text>
                  <View style={styles.inputContainer}>
                    <MapPin size={20} color="#FF6B35" />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: Dubaï"
                      value={formData.toCountry}
                      onChangeText={(text) => setFormData({ ...formData, toCountry: text })}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Date de départ *</Text>
                  <View style={styles.inputContainer}>
                    <Calendar size={20} color="#FF6B35" />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: 15 Janvier 2025"
                      value={formData.departureDate}
                      onChangeText={(text) => setFormData({ ...formData, departureDate: text })}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Poids maximum (kg)</Text>
                  <View style={styles.inputContainer}>
                    <Package size={20} color="#FF6B35" />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: 23"
                      value={formData.maxWeight}
                      onChangeText={(text) => setFormData({ ...formData, maxWeight: text })}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Prix par kg (F CFA)</Text>
                  <View style={styles.inputContainer}>
                    <DollarSign size={20} color="#FF6B35" />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: 5000"
                      value={formData.pricePerKg}
                      onChangeText={(text) => setFormData({ ...formData, pricePerKg: text })}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Espace disponible</Text>
                  <View style={styles.inputContainer}>
                    <Package size={20} color="#FF6B35" />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: 2 valises"
                      value={formData.availableSpace}
                      onChangeText={(text) => setFormData({ ...formData, availableSpace: text })}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>
                    {editingId ? 'Mettre à jour' : 'Ajouter'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
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
  },
  content: {
    padding: 20,
  },
  addButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
  announcementsList: {
    gap: 16,
  },
  announcementCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  announcementActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  updatedText: {
    fontSize: 12,
    color: '#6C757D',
    fontStyle: 'italic',
  },
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
  formContainer: {
    paddingBottom: 20,
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
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notSubscribedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  notSubscribedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 12,
  },
  notSubscribedText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  subscribeButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
