import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, MapPin, Package, Clock, Star, Plane } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { trpc } from '@/lib/trpc';
import type { TravelAnnouncement } from '@/backend/db/schema';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');

  const travelsQuery = trpc.travels.getAll.useQuery();
  const travels = travelsQuery.data || [];
  const featuredGPs = travels.slice(0, 2);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        style={[styles.header, { paddingTop: insets.top + 30 }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>GP Connect</Text>
          <Text style={styles.headerSubtitle}>
            Livraison fiable de colis entre l&apos;Afrique et le monde
          </Text>
        </View>
      </LinearGradient>

      {/* GP CTA Button */}
      <View style={styles.gpCtaSection}>
        <TouchableOpacity 
          style={styles.gpCtaButton}
          onPress={() => router.push('/become-gp')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={styles.gpCtaGradient}
          >
            <Plane size={24} color="white" />
            <View style={styles.gpCtaTextContainer}>
              <Text style={styles.gpCtaTitle}>Devenir GP</Text>
              <Text style={styles.gpCtaSubtitle}>Découvrez comment devenir Grand Passager</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Search Form */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Trouver votre GP</Text>
        
        <View style={styles.searchForm}>
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#FF6B35" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="De (Pays)"
                value={fromCountry}
                onChangeText={setFromCountry}
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#FF6B35" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Vers (Pays)"
                value={toCountry}
                onChangeText={setToCountry}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Package size={20} color="#FF6B35" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Poids (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Clock size={20} color="#FF6B35" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Date de voyage"
                value={date}
                onChangeText={setDate}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color="white" />
            <Text style={styles.searchButtonText}>Rechercher des GPs</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Featured GPs */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>GPs en vedette</Text>
        
        {travelsQuery.isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : featuredGPs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun GP disponible pour le moment</Text>
            <Text style={styles.emptySubtext}>Les GPs apparaîtront ici une fois inscrits</Text>
          </View>
        ) : (
          featuredGPs.map((travel: TravelAnnouncement) => (
            <TouchableOpacity 
              key={travel.id} 
              style={styles.gpCard}
              onPress={() => router.push(`/gp-profile/${travel.gpId}`)}
              activeOpacity={0.7}
            >
              <View style={styles.gpHeader}>
                <View style={styles.gpAvatar}>
                  <Text style={styles.gpAvatarText}>GP</Text>
                </View>
                <View style={styles.gpInfo}>
                  <Text style={styles.gpName}>Grand Passager</Text>
                  <View style={styles.gpRating}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>Nouveau</Text>
                  </View>
                </View>
                <View style={styles.gpPrice}>
                  <Text style={styles.priceText}>{travel.pricePerKg} F/kg</Text>
                </View>
              </View>
              
              <View style={styles.gpDetails}>
                <View style={styles.routeContainer}>
                  <Text style={styles.routeText}>{travel.fromCountry} → {travel.toCountry}</Text>
                </View>
                <View style={styles.gpMeta}>
                  <Text style={styles.metaText}>Départ: {travel.departureDate}</Text>
                  <Text style={styles.metaText}>Max: {travel.maxWeight}kg</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Statistics Section */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Colis livrés</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>GPs actifs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>98%</Text>
          <Text style={styles.statLabel}>Satisfaction</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  searchSection: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 16,
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
    marginBottom: 16,
  },
  searchForm: {
    gap: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
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
  searchButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  featuredSection: {
    padding: 20,
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
    alignItems: 'center',
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
  },
  gpAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gpInfo: {
    flex: 1,
  },
  gpName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  gpRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  tripsText: {
    fontSize: 12,
    color: '#6C757D',
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
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
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
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
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
  metaText: {
    fontSize: 12,
    color: '#6C757D',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
  },
  gpCtaSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  gpCtaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  gpCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 16,
  },
  gpCtaTextContainer: {
    flex: 1,
  },
  gpCtaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  gpCtaSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});