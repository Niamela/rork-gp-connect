import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Star,
  MapPin,
  Package,
  Clock,
  MessageCircle,
  CheckCircle,
  ChevronLeft,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { useTravels } from '@/contexts/TravelsContext';
import { useMessages } from '@/contexts/MessagesContext';

export default function GPProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { gpId } = useLocalSearchParams();
  const { userProfile } = useUser();
  const { getGpTravels } = useTravels();
  const { createConversation } = useMessages();

  const gpProfile = userProfile;
  const gpTravels = gpId ? getGpTravels(gpId as string) : [];

  const handleContactGP = async () => {
    if (!userProfile) {
      Alert.alert(
        'Connexion requise',
        'Vous devez créer un profil pour contacter un GP.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Créer un profil', onPress: () => router.push('/create-gp-profile') }
        ]
      );
      return;
    }

    if (!gpProfile) return;

    try {
      await createConversation({
        userId: userProfile.id,
        otherUserId: gpProfile.id,
        otherUserName: `${gpProfile.firstName} ${gpProfile.lastName}`,
        otherUserIsGP: true,
      });
      
      router.push('/messages');
    } catch (error) {
      console.error('Error creating conversation:', error);
      Alert.alert('Erreur', 'Impossible de créer la conversation');
    }
  };

  if (false) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
          <Text style={styles.loadingText}>Chargement du profil...</Text>
        </View>
      </View>
    );
  }

  if (!gpProfile) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
          <Text style={styles.loadingText}>Profil non trouvé</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#FF6B35', '#F7931E']}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {gpProfile.firstName[0]}{gpProfile.lastName[0]}
              </Text>
            </View>
            <Text style={styles.userName}>
              {gpProfile.firstName} {gpProfile.lastName}
            </Text>
            {gpProfile.isGP && gpProfile.gpSubscription?.isActive && (
              <View style={styles.gpBadge}>
                <CheckCircle size={16} color="white" />
                <Text style={styles.gpBadgeText}>Grand Passager Vérifié</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Star size={24} color="#FFD700" />
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Note moyenne</Text>
          </View>
          <View style={styles.statCard}>
            <Package size={24} color="#FF6B35" />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Colis livrés</Text>
          </View>
          <View style={styles.statCard}>
            <MapPin size={24} color="#28A745" />
            <Text style={styles.statNumber}>{gpTravels.length}</Text>
            <Text style={styles.statLabel}>Voyages</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations de contact</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoValue}>{gpProfile.contact}</Text>
            </View>
            {gpProfile.isGP && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Membre depuis</Text>
                  <Text style={styles.infoValue}>
                    {new Date(gpProfile.createdAt).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.travelsSection}>
          <Text style={styles.sectionTitle}>Voyages disponibles ({gpTravels.length})</Text>
          {false ? (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>Chargement des voyages...</Text>
            </View>
          ) : gpTravels.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Aucun voyage disponible pour le moment</Text>
            </View>
          ) : (
            gpTravels.map((travel: any) => (
              <View key={travel.id} style={styles.travelCard}>
                <View style={styles.routeContainer}>
                  <MapPin size={16} color="#FF6B35" />
                  <Text style={styles.routeText}>
                    {travel.fromCountry} → {travel.toCountry}
                  </Text>
                </View>
                
                <View style={styles.travelDetails}>
                  <View style={styles.detailRow}>
                    <Clock size={14} color="#6C757D" />
                    <Text style={styles.detailText}>Départ: {travel.departureDate}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Package size={14} color="#6C757D" />
                    <Text style={styles.detailText}>Max: {travel.maxWeight}kg</Text>
                  </View>
                </View>

                <View style={styles.availableSpace}>
                  <Text style={styles.availableSpaceText}>
                    Espace: {travel.availableSpace}
                  </Text>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Prix</Text>
                  <Text style={styles.priceText}>{travel.pricePerKg} F/kg</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactGP}
          disabled={false}
        >
          <MessageCircle size={20} color="white" />
          <Text style={styles.contactButtonText}>
            {'Contacter ce GP'}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  gpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 167, 69, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    gap: 8,
  },
  gpBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6C757D',
    textAlign: 'center',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6C757D',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  divider: {
    height: 1,
    backgroundColor: '#F8F9FA',
    marginVertical: 16,
  },
  travelsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 100,
  },
  travelCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 12,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  travelDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#6C757D',
  },
  availableSpace: {
    marginBottom: 12,
  },
  availableSpaceText: {
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F8F9FA',
  },
  priceLabel: {
    fontSize: 14,
    color: '#6C757D',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingText: {
    fontSize: 16,
    color: '#6C757D',
  },
  emptyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingTop: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
