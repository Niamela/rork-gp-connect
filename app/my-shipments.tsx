import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Package, MapPin, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import { useUser } from '@/contexts/UserContext';
import type { ShipmentStatus } from '@/backend/db/schema';

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

export default function MyShipmentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userProfile } = useUser();

  const shipmentsQuery = trpc.shipments.getUserShipments.useQuery(
    { userId: userProfile?.id || '' },
    { enabled: !!userProfile?.id }
  );

  const shipments = shipmentsQuery.data || [];

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

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Mes envois',
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
          <>
            <View style={styles.emptyState}>
              <Package size={64} color="#ADB5BD" />
              <Text style={styles.emptyTitle}>Aucun envoi</Text>
              <Text style={styles.emptyDescription}>
                Vous n&apos;avez pas encore d&apos;envois en cours
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 Suivez l&apos;état de vos colis en temps réel. Vous recevrez des notifications à chaque étape importante.
              </Text>
            </View>
          </>
        ) : (
          <>
            {shipments.map((shipment) => (
              <View key={shipment.id} style={styles.shipmentCard}>
                <View style={styles.shipmentHeader}>
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
                  <View style={styles.routeContainer}>
                    <View style={styles.currentLocation}>
                      <MapPin size={16} color="#FF6B35" />
                      <View style={styles.locationInfo}>
                        <Text style={styles.locationLabel}>Localisation actuelle</Text>
                        <Text style={styles.locationText}>
                          {shipment.trackingHistory[shipment.trackingHistory.length - 1].location}
                        </Text>
                        {shipment.trackingHistory[shipment.trackingHistory.length - 1].notes && (
                          <Text style={styles.locationNotes}>
                            {shipment.trackingHistory[shipment.trackingHistory.length - 1].notes}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                )}

                {shipment.trackingHistory.length > 1 && (
                  <View style={styles.historySection}>
                    <Text style={styles.historyTitle}>Historique de suivi</Text>
                    {shipment.trackingHistory.slice().reverse().map((update, index) => (
                      <View key={index} style={styles.historyItem}>
                        <View style={styles.historyTimeline}>
                          <View style={[
                            styles.historyDot,
                            index === 0 && styles.historyDotActive
                          ]} />
                          {index < shipment.trackingHistory.length - 1 && (
                            <View style={styles.historyLine} />
                          )}
                        </View>
                        <View style={styles.historyContent}>
                          <Text style={styles.historyStatus}>
                            {STATUS_LABELS[update.status]}
                          </Text>
                          <Text style={styles.historyLocation}>{update.location}</Text>
                          {update.notes && (
                            <Text style={styles.historyNotes}>{update.notes}</Text>
                          )}
                          <View style={styles.historyTimeContainer}>
                            <Clock size={12} color="#ADB5BD" />
                            <Text style={styles.historyTime}>
                              {new Date(update.timestamp).toLocaleString('fr-FR')}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.shipmentFooter}>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerText}>
                      Créé le {new Date(shipment.createdAt).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 Le GP met à jour le statut de votre colis à chaque étape importante du voyage.
              </Text>
            </View>
          </>
        )}
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
  shipmentHeader: {
    marginBottom: 16,
  },
  trackingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackingNumber: {
    fontSize: 18,
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
  routeContainer: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
    marginTop: 4,
    marginRight: 12,
  },
  routeDotDestination: {
    backgroundColor: '#28A745',
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 2,
  },
  routeLocation: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E9ECEF',
    marginLeft: 5,
    marginVertical: 4,
  },
  currentLocation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  locationNotes: {
    fontSize: 13,
    color: '#6C757D',
    fontStyle: 'italic',
  },
  historySection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  historyTimeline: {
    alignItems: 'center',
    marginRight: 12,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E9ECEF',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  historyDotActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  historyLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E9ECEF',
    marginVertical: 2,
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
  historyTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyTime: {
    fontSize: 11,
    color: '#ADB5BD',
  },
  shipmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F8F9FA',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: '#6C757D',
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
  infoBox: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
});
