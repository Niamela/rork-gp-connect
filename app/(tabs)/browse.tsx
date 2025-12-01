import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Search, Filter, MapPin, Package, Clock, MessageCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTravels } from '@/contexts/TravelsContext';
import { useUser } from '@/contexts/UserContext';
import { useMessages } from '@/contexts/MessagesContext';
import { useRouter } from 'expo-router';
import type { TravelAnnouncement } from '@/contexts/UserContext';

export default function BrowseScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userProfile } = useUser();
  const { getTravelsWithGPInfo, isLoading } = useTravels();
  const { createConversation } = useMessages();
  const travelsWithInfo = getTravelsWithGPInfo();
  const [searchQuery, setSearchQuery] = useState('');

  const handleContactGP = async (travel: TravelAnnouncement, gpName: string) => {
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

    try {
      await createConversation({
        userId: userProfile.id,
        otherUserId: travel.gpId,
        otherUserName: gpName,
        otherUserIsGP: true,
        travelId: travel.id,
      });
      
      router.push('/messages');
    } catch (error) {
      console.error('Error creating conversation:', error);
      Alert.alert('Erreur', 'Impossible de créer la conversation');
    }
  };

  const filteredTravels = travelsWithInfo.filter((travel) => {
    const route = `${travel.fromCountry} → ${travel.toCountry}`;
    const matchesSearch = route.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={[styles.searchHeader, { paddingTop: insets.top + 16 }]}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6C757D" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des GPs ou des itinéraires..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsCount}>
          {filteredTravels.length} voyage{filteredTravels.length !== 1 ? 's' : ''} trouvé{filteredTravels.length !== 1 ? 's' : ''}
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : filteredTravels.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun voyage disponible pour le moment</Text>
          </View>
        ) : (
          filteredTravels.map((travel) => {
            const gpName = travel.gpProfile 
              ? `${travel.gpProfile.firstName} ${travel.gpProfile.lastName}` 
              : 'GP Voyageur';
            return (
              <TouchableOpacity 
                key={travel.id} 
                style={styles.gpCard}
                onPress={() => router.push(`/gp-profile/${travel.gpId}`)}
                activeOpacity={0.7}
              >
                <View style={styles.gpHeader}>
                  <View style={styles.gpAvatar}>
                    {travel.gpProfile?.profileImageUri ? (
                      <Image 
                        source={{ uri: travel.gpProfile.profileImageUri }} 
                        style={styles.gpAvatarImage}
                      />
                    ) : (
                      <Text style={styles.gpAvatarText}>
                        {travel.gpProfile ? `${travel.gpProfile.firstName[0]}${travel.gpProfile.lastName[0]}` : 'GP'}
                      </Text>
                    )}
                  </View>
                  <View style={styles.gpInfo}>
                    <View style={styles.gpNameRow}>
                      <Text style={styles.gpName}>{gpName}</Text>
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                      </View>
                    </View>
                    <View style={styles.gpType}>
                      <View style={[styles.typeTag, { backgroundColor: '#28A745' }]}>
                        <Text style={styles.typeText}>Grand Passager</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.gpPrice}>
                    <Text style={styles.priceText}>{travel.pricePerKg} F/kg</Text>
                  </View>
                </View>
                
                <View style={styles.gpDetails}>
                  <View style={styles.routeContainer}>
                    <MapPin size={14} color="#FF6B35" />
                    <Text style={styles.routeText}>{travel.fromCountry} → {travel.toCountry}</Text>
                  </View>
                  <View style={styles.gpMeta}>
                    <View style={styles.metaItem}>
                      <Clock size={12} color="#6C757D" />
                      <Text style={styles.metaText}>Départ: {travel.departureDate}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Package size={12} color="#6C757D" />
                      <Text style={styles.metaText}>Max: {travel.maxWeight}kg</Text>
                    </View>
                  </View>
                  <View style={styles.availableSpace}>
                    <Text style={styles.availableSpaceText}>Espace disponible: {travel.availableSpace}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleContactGP(travel, gpName);
                  }}
                >
                  <MessageCircle size={16} color="white" />
                  <Text style={styles.contactButtonText}>Contacter</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
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
  searchHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 16,
  },
  gpCard: {
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
  gpHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gpAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  gpAvatarImage: {
    width: '100%',
    height: '100%',
  },
  gpAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gpInfo: {
    flex: 1,
  },
  gpNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  gpName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: '#28A745',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gpType: {
    marginBottom: 4,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  typeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  gpPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  gpDetails: {
    gap: 8,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  gpMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6C757D',
  },
  availableSpace: {
    marginTop: 8,
  },
  availableSpaceText: {
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: '500',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6C757D',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
});
