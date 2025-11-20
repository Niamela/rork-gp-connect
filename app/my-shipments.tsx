import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Package, MapPin, Clock, CheckCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const mockShipments = [
  {
    id: '1',
    trackingNumber: 'GP2024001',
    from: 'Paris, France',
    to: 'Abidjan, Côte d&apos;Ivoire',
    status: 'En transit',
    statusColor: '#FF6B35',
    date: '15 Jan 2024',
    weight: '5 kg',
  },
  {
    id: '2',
    trackingNumber: 'GP2024002',
    from: 'Lyon, France',
    to: 'Dakar, Sénégal',
    status: 'Livré',
    statusColor: '#28A745',
    date: '10 Jan 2024',
    weight: '3 kg',
  },
  {
    id: '3',
    trackingNumber: 'GP2024003',
    from: 'Marseille, France',
    to: 'Lomé, Togo',
    status: 'En attente',
    statusColor: '#FFC107',
    date: '20 Jan 2024',
    weight: '7 kg',
  },
];

export default function MyShipmentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Livré':
        return <CheckCircle size={20} color="#28A745" />;
      case 'En transit':
        return <Package size={20} color="#FF6B35" />;
      default:
        return <Clock size={20} color="#FFC107" />;
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
        {mockShipments.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={64} color="#ADB5BD" />
            <Text style={styles.emptyTitle}>Aucun envoi</Text>
            <Text style={styles.emptyDescription}>
              Vous n&apos;avez pas encore d&apos;envois en cours
            </Text>
          </View>
        ) : (
          mockShipments.map((shipment) => (
            <TouchableOpacity key={shipment.id} style={styles.shipmentCard}>
              <View style={styles.shipmentHeader}>
                <View style={styles.trackingInfo}>
                  <Text style={styles.trackingNumber}>{shipment.trackingNumber}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${shipment.statusColor}20` }]}>
                    {getStatusIcon(shipment.status)}
                    <Text style={[styles.statusText, { color: shipment.statusColor }]}>
                      {shipment.status}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.routeContainer}>
                <View style={styles.routePoint}>
                  <View style={styles.routeDot} />
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeLabel}>Départ</Text>
                    <Text style={styles.routeLocation}>{shipment.from}</Text>
                  </View>
                </View>

                <View style={styles.routeLine} />

                <View style={styles.routePoint}>
                  <View style={[styles.routeDot, styles.routeDotDestination]} />
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeLabel}>Destination</Text>
                    <Text style={styles.routeLocation}>{shipment.to}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.shipmentFooter}>
                <View style={styles.footerItem}>
                  <Clock size={16} color="#6C757D" />
                  <Text style={styles.footerText}>{shipment.date}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Package size={16} color="#6C757D" />
                  <Text style={styles.footerText}>{shipment.weight}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Suivez l'��tat de vos colis en temps réel. Vous recevrez des notifications à chaque étape importante.
          </Text>
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
