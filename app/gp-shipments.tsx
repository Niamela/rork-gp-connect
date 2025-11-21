import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Package,
  MapPin,
  CheckCircle,
  Truck,
  AlertCircle,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import { useUser } from '@/contexts/UserContext';
import type { Shipment, ShipmentStatus } from '@/backend/db/schema';

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  pending: 'En attente',
  accepted: 'Accepté',
  in_transit: 'En transit',
  customs: 'En douane',
  out_for_delivery: 'En livraison',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

const STATUS_COLORS: Record<ShipmentStatus, string> = {
  pending: '#FFA500',
  accepted: '#4169E1',
  in_transit: '#20B2AA',
  customs: '#FFD700',
  out_for_delivery: '#32CD32',
  delivered: '#28A745',
  cancelled: '#DC3545',
};

const STATUS_OPTIONS: { value: ShipmentStatus; label: string }[] = [
  { value: 'pending', label: 'En attente' },
  { value: 'accepted', label: 'Accepté' },
  { value: 'in_transit', label: 'En transit' },
  { value: 'customs', label: 'En douane' },
  { value: 'out_for_delivery', label: 'En livraison' },
  { value: 'delivered', label: 'Livré' },
];

export default function GPShipmentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userProfile } = useUser();

  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('pending');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const shipmentsQuery = trpc.shipments.getGpShipments.useQuery(
    { gpId: userProfile?.id || '' },
    { enabled: !!userProfile?.id && userProfile?.isGP }
  );

  const updateStatusMutation = trpc.shipments.updateStatus.useMutation({
    onSuccess: () => {
      shipmentsQuery.refetch();
      setModalVisible(false);
      setSelectedShipment(null);
      setLocation('');
      setNotes('');
      Alert.alert('Succès', 'Le statut du colis a été mis à jour');
    },
    onError: (error) => {
      Alert.alert('Erreur', error.message);
    },
  });

  const shipments = shipmentsQuery.data || [];

  const handleUpdateStatus = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setNewStatus(shipment.status);
    setModalVisible(true);
  };

  const handleSubmitUpdate = () => {
    if (!selectedShipment) return;
    if (!location.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une localisation');
      return;
    }

    updateStatusMutation.mutate({
      shipmentId: selectedShipment.id,
      status: newStatus,
      location: location.trim(),
      notes: notes.trim(),
    });
  };

  const getStatusIcon = (status: ShipmentStatus) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={20} color={STATUS_COLORS[status]} />;
      case 'in_transit':
      case 'out_for_delivery':
        return <Truck size={20} color={STATUS_COLORS[status]} />;
      case 'cancelled':
        return <AlertCircle size={20} color={STATUS_COLORS[status]} />;
      default:
        return <Package size={20} color={STATUS_COLORS[status]} />;
    }
  };

  if (!userProfile?.isGP) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Mes livraisons',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                <ArrowLeft size={24} color="#2C3E50" />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Accès réservé aux GP</Text>
          <Text style={styles.emptyDescription}>
            Cette page est réservée aux Grands Passagers
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Mes livraisons',
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
        {shipmentsQuery.isLoading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyDescription}>Chargement...</Text>
          </View>
        ) : shipments.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={64} color="#ADB5BD" />
            <Text style={styles.emptyTitle}>Aucune livraison</Text>
            <Text style={styles.emptyDescription}>
              Vous n&apos;avez pas encore de livraisons en cours
            </Text>
          </View>
        ) : (
          shipments.map((shipment) => (
            <View key={shipment.id} style={styles.shipmentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.trackingInfo}>
                  <Text style={styles.trackingNumber}>{shipment.trackingNumber}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${STATUS_COLORS[shipment.status]}20` },
                    ]}
                  >
                    {getStatusIcon(shipment.status)}
                    <Text
                      style={[
                        styles.statusText,
                        { color: STATUS_COLORS[shipment.status] },
                      ]}
                    >
                      {STATUS_LABELS[shipment.status]}
                    </Text>
                  </View>
                </View>
              </View>

              {shipment.trackingHistory.length > 0 && (
                <View style={styles.lastUpdate}>
                  <MapPin size={14} color="#6C757D" />
                  <Text style={styles.lastUpdateText}>
                    {shipment.trackingHistory[shipment.trackingHistory.length - 1].location}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => handleUpdateStatus(shipment)}
              >
                <Text style={styles.updateButtonText}>Mettre à jour le statut</Text>
              </TouchableOpacity>

              {shipment.trackingHistory.length > 0 && (
                <View style={styles.historySection}>
                  <Text style={styles.historySectionTitle}>Historique</Text>
                  {shipment.trackingHistory.slice().reverse().map((update, index) => (
                    <View key={index} style={styles.historyItem}>
                      <View style={styles.historyDot} />
                      <View style={styles.historyContent}>
                        <Text style={styles.historyStatus}>
                          {STATUS_LABELS[update.status]}
                        </Text>
                        <Text style={styles.historyLocation}>
                          {update.location}
                        </Text>
                        {update.notes && (
                          <Text style={styles.historyNotes}>{update.notes}</Text>
                        )}
                        <Text style={styles.historyTime}>
                          {new Date(update.timestamp).toLocaleString('fr-FR')}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mettre à jour le statut</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.label}>Nouveau statut</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.statusScroll}
              >
                {STATUS_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.statusOption,
                      newStatus === option.value && styles.statusOptionSelected,
                      {
                        borderColor: STATUS_COLORS[option.value],
                        backgroundColor:
                          newStatus === option.value
                            ? STATUS_COLORS[option.value]
                            : 'white',
                      },
                    ]}
                    onPress={() => setNewStatus(option.value)}
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        newStatus === option.value && styles.statusOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Localisation actuelle *</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Ex: Paris CDG, En route vers..."
                placeholderTextColor="#ADB5BD"
              />

              <Text style={styles.label}>Notes (optionnel)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Informations supplémentaires..."
                placeholderTextColor="#ADB5BD"
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  updateStatusMutation.isPending && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitUpdate}
                disabled={updateStatusMutation.isPending}
              >
                <Text style={styles.submitButtonText}>
                  {updateStatusMutation.isPending ? 'Mise à jour...' : 'Confirmer'}
                </Text>
              </TouchableOpacity>
            </View>
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
  shipmentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  trackingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  lastUpdate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  lastUpdateText: {
    fontSize: 14,
    color: '#6C757D',
  },
  updateButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  historySection: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  historySectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    marginTop: 6,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  historyLocation: {
    fontSize: 13,
    color: '#495057',
    marginBottom: 2,
  },
  historyNotes: {
    fontSize: 12,
    color: '#6C757D',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 11,
    color: '#ADB5BD',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    color: '#6C757D',
    textAlign: 'center',
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
    maxHeight: '90%',
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
  modalClose: {
    fontSize: 28,
    color: '#6C757D',
    fontWeight: '300' as const,
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    marginTop: 12,
  },
  statusScroll: {
    marginBottom: 12,
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
  },
  statusOptionSelected: {
    borderWidth: 2,
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
  },
  statusOptionTextSelected: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#2C3E50',
    backgroundColor: 'white',
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
