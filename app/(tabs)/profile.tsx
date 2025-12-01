import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Settings, 
  Bell, 
  HelpCircle, 
  LogOut,
  Star,
  Package,
  MapPin,
  ChevronRight,
  Shield,
  FileText,
  Mail,
  X,
  CheckCircle
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { useTravels } from '@/contexts/TravelsContext';
import type { TravelAnnouncement } from '@/contexts/UserContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userProfile, hasProfile, updateUserProfile, clearUserProfile } = useUser();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  const isGPSubscribed = userProfile?.isGP && userProfile?.gpSubscription?.isActive;
  
  const { getGpTravels } = useTravels();
  const gpTravels = userProfile?.id ? getGpTravels(userProfile.id) : [];
  
  const handleBecomeGP = () => {
    if (!hasProfile) {
      Alert.alert(
        'Profil requis',
        'Vous devez créer un profil avant de devenir GP.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (isGPSubscribed) {
      Alert.alert(
        'Déjà abonné',
        'Vous êtes déjà un GP avec un abonnement actif.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setShowSubscriptionModal(true);
  };
  
  const handleSubscribe = async () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    await updateUserProfile({
      isGP: true,
      gpSubscription: {
        isActive: true,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        amount: 10000,
      },
    });
    
    setShowSubscriptionModal(false);
    Alert.alert(
      'Abonnement activé',
      'Félicitations ! Vous êtes maintenant un GP. Vous pouvez mettre à jour vos informations de voyage et contacter les annonces.',
      [{ text: 'OK' }]
    );
  };
  
  const gpMenuItems = isGPSubscribed ? [
    {
      icon: MapPin,
      title: 'Mes voyages',
      subtitle: 'Gérer mes annonces de voyage',
      onPress: () => router.push('/gp-travels'),
      isGPOnly: true,
    },
  ] : [];

  const menuItems = [
    ...gpMenuItems,
    {
      icon: User,
      title: 'Modifier le profil',
      subtitle: 'Mettre à jour vos informations personnelles',
      onPress: () => router.push('/edit-profile'),
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Configurer vos préférences de notification',
      onPress: () => router.push('/notifications'),
    },
    {
      icon: Package,
      title: 'Mes envois',
      subtitle: 'Suivre l\'historique de vos colis',
      onPress: () => router.push('/my-shipments'),
    },
    {
      icon: Settings,
      title: 'Paramètres',
      subtitle: 'Préférences de l\'application et confidentialité',
      onPress: () => router.push('/settings'),
    },
    {
      icon: HelpCircle,
      title: 'Aide & Support',
      subtitle: 'Obtenir de l\'aide ou contacter le support',
      onPress: () => router.push('/help-support'),
    },
  ];

  const legalItems = [
    {
      icon: Shield,
      title: 'Politique de confidentialité',
      onPress: () => router.push('/privacy'),
    },
    {
      icon: FileText,
      title: 'Conditions d\'utilisation',
      onPress: () => router.push('/terms'),
    },
    {
      icon: Mail,
      title: 'Contact',
      onPress: () => router.push('/contact'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        style={[styles.profileHeader, { paddingTop: insets.top + 30 }]}
      >
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {hasProfile && userProfile
                ? `${userProfile.firstName[0]}${userProfile.lastName[0]}`
                : 'GP'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {hasProfile && userProfile
              ? `${userProfile.firstName} ${userProfile.lastName}`
              : 'Invité'}
          </Text>
          <Text style={styles.userEmail}>
            {hasProfile && userProfile ? userProfile.contact : 'Connectez-vous pour commencer'}
          </Text>
          
          {!hasProfile && (
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/auth')}
            >
              <Text style={styles.loginButtonText}>Se connecter ou S&apos;inscrire</Text>
            </TouchableOpacity>
          )}
          
          
          {isGPSubscribed ? (
            <View style={styles.gpBadge}>
              <CheckCircle size={16} color="white" />
              <Text style={styles.gpBadgeText}>Grand Passager Actif</Text>
            </View>
          ) : hasProfile ? (
            <View>
              <View style={styles.regularUserBadge}>
                <Text style={styles.regularUserBadgeText}>Particulier</Text>
              </View>
              <TouchableOpacity 
                style={styles.becomeGPButton}
                onPress={handleBecomeGP}
              >
                <Text style={styles.becomeGPText}>Devenir un GP - 10 000 F/mois</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.becomeGPButton}
              onPress={handleBecomeGP}
            >
              <Text style={styles.becomeGPText}>Devenir un GP - 10 000 F/mois</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Package size={24} color="#FF6B35" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Colis envoyés</Text>
        </View>
        <View style={styles.statCard}>
          <Star size={24} color="#FFD700" />
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Note</Text>
        </View>
        <View style={styles.statCard}>
          <MapPin size={24} color="#28A745" />
          <Text style={styles.statNumber}>{gpTravels.length}</Text>
          <Text style={styles.statLabel}>Voyages</Text>
        </View>
      </View>

      {/* GP Travel Announcements */}
      {isGPSubscribed && gpTravels.length > 0 && (
        <View style={styles.travelsSection}>
          <View style={styles.travelsSectionHeader}>
            <Text style={styles.travelsSectionTitle}>Mes voyages actifs</Text>
            <TouchableOpacity onPress={() => router.push('/gp-travels')}>
              <Text style={styles.viewAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.travelsScroll}>
            {gpTravels.slice(0, 3).map((travel) => (
              <TouchableOpacity
                key={travel.id}
                style={styles.travelCard}
                onPress={() => router.push('/gp-travels')}
              >
                <View style={styles.travelRoute}>
                  <Text style={styles.travelCountry}>{travel.fromCountry}</Text>
                  <MapPin size={16} color="#FF6B35" />
                  <Text style={styles.travelCountry}>{travel.toCountry}</Text>
                </View>
                <Text style={styles.travelDate}>{travel.departureDate}</Text>
                <View style={styles.travelDetails}>
                  <Text style={styles.travelDetail}>Max: {travel.maxWeight} kg</Text>
                  <Text style={styles.travelDetail}>{travel.pricePerKg} F/kg</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <item.icon size={20} color="#FF6B35" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#6C757D" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Legal & Contact */}
      <View style={styles.legalContainer}>
        <Text style={styles.legalSectionTitle}>Légal & Contact</Text>
        {legalItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.legalItem}
            onPress={item.onPress}
          >
            <View style={styles.legalItemLeft}>
              <item.icon size={18} color="#6C757D" />
              <Text style={styles.legalItemText}>{item.title}</Text>
            </View>
            <ChevronRight size={18} color="#6C757D" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => {
          Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
              { text: 'Annuler', style: 'cancel' },
              {
                text: 'Se déconnecter',
                style: 'destructive',
                onPress: async () => {
                  await clearUserProfile();
                  Alert.alert('Déconnecté', 'Vous avez été déconnecté avec succès');
                },
              },
            ]
          );
        }}
      >
        <LogOut size={20} color="#DC3545" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>GP Connect v1.0.0</Text>
        <Text style={styles.appDescription}>
          Connecter l&apos;Afrique au monde, un colis à la fois
        </Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showSubscriptionModal}
        onRequestClose={() => setShowSubscriptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Abonnement GP</Text>
              <TouchableOpacity onPress={() => setShowSubscriptionModal(false)}>
                <X size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.subscriptionCard}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceAmount}>10 000 F</Text>
                  <Text style={styles.pricePeriod}>/ mois</Text>
                </View>

                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresTitle}>Avantages inclus :</Text>
                  
                  <View style={styles.featureItem}>
                    <CheckCircle size={20} color="#28A745" />
                    <Text style={styles.featureText}>
                      Contacter toutes les annonces de demandes
                    </Text>
                  </View>

                  <View style={styles.featureItem}>
                    <CheckCircle size={20} color="#28A745" />
                    <Text style={styles.featureText}>
                      Mettre à jour vos informations de voyage illimitées
                    </Text>
                  </View>

                  <View style={styles.featureItem}>
                    <CheckCircle size={20} color="#28A745" />
                    <Text style={styles.featureText}>
                      Profil visible dans la recherche de GPs
                    </Text>
                  </View>

                  <View style={styles.featureItem}>
                    <CheckCircle size={20} color="#28A745" />
                    <Text style={styles.featureText}>
                      Badge GP vérifié sur votre profil
                    </Text>
                  </View>

                  <View style={styles.featureItem}>
                    <CheckCircle size={20} color="#28A745" />
                    <Text style={styles.featureText}>
                      Support prioritaire
                    </Text>
                  </View>
                </View>

                <View style={styles.noteContainer}>
                  <Text style={styles.noteText}>
                    💡 Vous pouvez mettre à jour vos informations de voyage autant de fois que vous le souhaitez pendant votre abonnement.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.subscribeButton}
                  onPress={handleSubscribe}
                >
                  <Text style={styles.subscribeButtonText}>S&apos;abonner maintenant</Text>
                </TouchableOpacity>

                <Text style={styles.subscriptionDisclaimer}>
                  L&apos;abonnement est renouvelé automatiquement chaque mois. Vous pouvez annuler à tout moment.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  profileHeader: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
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
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  becomeGPButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  becomeGPText: {
    color: 'white',
    fontSize: 16,
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
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6C757D',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC3545',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    color: '#ADB5BD',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  travelsSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  travelsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  travelsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  travelsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  travelCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  travelRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  travelCountry: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  travelDate: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 8,
  },
  travelDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  travelDetail: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '500',
  },
  legalContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  legalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 12,
    marginLeft: 4,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  legalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legalItemText: {
    fontSize: 15,
    color: '#2C3E50',
  },
  gpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 167, 69, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    gap: 8,
  },
  gpBadgeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  subscriptionCard: {
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#FFF5F0',
    borderRadius: 16,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  pricePeriod: {
    fontSize: 18,
    color: '#6C757D',
    marginLeft: 8,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: '#2C3E50',
    lineHeight: 22,
  },
  noteContainer: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  noteText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  subscribeButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  subscriptionDisclaimer: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 18,
  },
  regularUserBadge: {
    backgroundColor: 'rgba(25, 118, 210, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 12,
    alignSelf: 'center',
  },
  regularUserBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
});