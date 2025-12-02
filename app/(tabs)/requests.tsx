import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Plus, MapPin, Package, Calendar, User, X, MessageCircle, CheckCircle, Box, Trash2, Filter, Search, XCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useRequests } from '@/contexts/RequestsContext';
import { useMessages } from '@/contexts/MessagesContext';
import { useRouter } from 'expo-router';

interface Request {
  id: string;
  userId: string;
  userName: string;
  fromCountry: string;
  toCountry: string;
  weight: string;
  date: string;
  productType: string;
  description?: string;
  postedDate: string;
  contactInfo: string;
}

export default function RequestsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { hasProfile, userProfile, createProfile } = useUser();
  const { requests, addRequest, deleteRequest: deleteReq, isLoading } = useRequests();
  const { createConversation } = useMessages();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [contact, setContact] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFromCountry, setFilterFromCountry] = useState('');
  const [filterToCountry, setFilterToCountry] = useState('');
  const [filterProductType, setFilterProductType] = useState('');
  
  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [productType, setProductType] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');



  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchQuery === '' ||
      request.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.fromCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.toCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.productType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFromCountry = filterFromCountry === '' ||
      request.fromCountry.toLowerCase().includes(filterFromCountry.toLowerCase());

    const matchesToCountry = filterToCountry === '' ||
      request.toCountry.toLowerCase().includes(filterToCountry.toLowerCase());

    const matchesProductType = filterProductType === '' ||
      request.productType.toLowerCase().includes(filterProductType.toLowerCase());

    return matchesSearch && matchesFromCountry && matchesToCountry && matchesProductType;
  });

  const hasActiveFilters = filterFromCountry !== '' || filterToCountry !== '' || filterProductType !== '';

  const clearFilters = () => {
    setFilterFromCountry('');
    setFilterToCountry('');
    setFilterProductType('');
  };

  const handleCreateProfile = async () => {
    if (!firstName || !lastName || !country || !contact) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await createProfile({
        firstName,
        lastName,
        country,
        contact,
        password: 'default123',
        isGP: false,
      });
      
      setProfileModalVisible(false);
      setFirstName('');
      setLastName('');
      setCountry('');
      setContact('');
      
      Alert.alert(
        'Profil créé',
        'Votre profil a été créé avec succès. Vous pouvez maintenant publier des demandes.',
        [{ text: 'OK', onPress: () => setModalVisible(true) }]
      );
    } catch {
      Alert.alert('Erreur', 'Impossible de créer le profil. Veuillez réessayer.');
    }
  };



  const handleDeleteRequest = async (requestId: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette demande ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReq(requestId);
              Alert.alert('Succès', 'Demande supprimée avec succès');
            } catch (error) {
              console.error('Error deleting request:', error);
              Alert.alert('Erreur', 'Impossible de supprimer la demande');
            }
          },
        },
      ]
    );
  };

  const handleContactRequest = async (request: Request) => {
    if (!userProfile?.isGP || !userProfile?.gpSubscription?.isActive) {
      Alert.alert(
        'Abonnement GP requis',
        'Pour contacter une annonce de particulier, vous devez créer un profil GP avec un abonnement actif de 10 000 F/mois.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Créer un profil GP', onPress: () => router.push('/create-gp-profile') }
        ]
      );
      return;
    }
    
    try {
      await createConversation({
        userId: userProfile.id,
        otherUserId: request.userId,
        otherUserName: request.userName,
        otherUserIsGP: false,
        requestId: request.id,
      });
      
      router.push('/messages');
    } catch (error) {
      console.error('Error creating conversation:', error);
      Alert.alert('Erreur', 'Impossible de créer la conversation');
    }
  };

  const handlePublishRequest = async () => {
    if (!hasProfile) {
      Alert.alert(
        'Profil requis',
        'Vous devez créer un profil gratuit pour publier une demande.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Créer un profil', onPress: () => {
            setModalVisible(false);
            setProfileModalVisible(true);
          }}
        ]
      );
      return;
    }

    if (!fromCountry || !toCountry || !weight || !date || !productType || !contactInfo) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await addRequest({
        userId: userProfile!.id,
        userName: `${userProfile?.firstName} ${userProfile?.lastName}`,
        fromCountry,
        toCountry,
        weight,
        date,
        productType,
        description: description || '',
        contactInfo,
      });
      
      setModalVisible(false);
      setFromCountry('');
      setToCountry('');
      setWeight('');
      setDate('');
      setProductType('');
      setDescription('');
      setContactInfo('');
      
      Alert.alert('Succès', 'Votre demande a été publiée avec succès!');
    } catch (error) {
      console.error('Error creating request:', error);
      Alert.alert('Erreur', 'Impossible de publier la demande. Veuillez réessayer.');
    }
  };

  const handleFabPress = () => {
    if (!hasProfile) {
      Alert.alert(
        'Profil requis',
        'Vous devez créer un profil gratuit pour publier une demande.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Créer un profil', onPress: () => setProfileModalVisible(true) }
        ]
      );
    } else {
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.headerTitle}>Demandes de GP</Text>
          <Text style={styles.headerSubtitle}>
            Publiez votre demande et les GPs vous contacteront
          </Text>
        </View>
        
        {/* Search and Filter Bar */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#6C757D" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Filter size={18} color={hasActiveFilters ? "white" : "#FF6B35"} />
            {hasActiveFilters && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {hasActiveFilters && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersLabel}>Filtres actifs:</Text>
            <View style={styles.filterTagsContainer}>
              {filterFromCountry && (
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>De: {filterFromCountry}</Text>
                </View>
              )}
              {filterToCountry && (
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>Vers: {filterToCountry}</Text>
                </View>
              )}
              {filterProductType && (
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>{filterProductType}</Text>
                </View>
              )}
              <TouchableOpacity onPress={clearFilters} style={styles.clearFiltersButton}>
                <XCircle size={16} color="#FF6B35" />
                <Text style={styles.clearFiltersText}>Effacer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Comment ça marche ?</Text>
          <Text style={styles.infoText}>
            1. Publiez votre demande avec les détails de votre envoi{'\n'}
            2. Les GPs disponibles verront votre annonce{'\n'}
            3. Ils vous contacteront directement pour discuter
          </Text>
        </View>

        <View style={styles.requestsHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery || hasActiveFilters 
              ? `${filteredRequests.length} résultat${filteredRequests.length !== 1 ? 's' : ''} trouvé${filteredRequests.length !== 1 ? 's' : ''}`
              : `Demandes récentes (${filteredRequests.length})`
            }
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : filteredRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || hasActiveFilters 
                ? 'Aucune demande ne correspond à vos critères'
                : 'Aucune demande pour le moment'
              }
            </Text>
          </View>
        ) : (
          filteredRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.userAvatar}>
                <User size={20} color="#FF6B35" />
              </View>
              <View style={styles.requestHeaderInfo}>
                <Text style={styles.userName}>{request.userName}</Text>
                <Text style={styles.postedDate}>{request.postedDate}</Text>
              </View>
            </View>

            <View style={styles.routeInfo}>
              <View style={styles.routeBadge}>
                <MapPin size={16} color="#FF6B35" />
                <Text style={styles.routeText}>
                  {request.fromCountry} → {request.toCountry}
                </Text>
              </View>
            </View>

            <View style={styles.requestDetails}>
              <View style={styles.detailItem}>
                <Package size={14} color="#6C757D" />
                <Text style={styles.detailText}>{request.weight}</Text>
              </View>
              <View style={styles.detailItem}>
                <Calendar size={14} color="#6C757D" />
                <Text style={styles.detailText}>{request.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Box size={14} color="#6C757D" />
                <Text style={styles.detailText}>{request.productType}</Text>
              </View>
            </View>

            {request.description ? (
              <Text style={styles.description}>{request.description}</Text>
            ) : null}

            <View style={styles.cardActions}>
              {userProfile?.id === request.userId && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteRequest(request.id)}
                >
                  <Trash2 size={16} color="white" />
                  <Text style={styles.deleteButtonText}>Supprimer</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.contactButton, userProfile?.id === request.userId && styles.contactButtonSmall]}
                onPress={() => handleContactRequest(request)}
              >
                <MessageCircle size={18} color="white" />
                <Text style={styles.contactButtonText}>Contacter</Text>
              </TouchableOpacity>
            </View>
          </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={handleFabPress}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Créer votre profil</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <X size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.profileInfoCard}>
                <Text style={styles.profileInfoText}>
                  Pour publier une demande, vous devez créer un profil gratuit.
                  Cela permet aux GPs de vous identifier et de vous contacter.
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Prénom *</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color="#FF6B35" />
                  <TextInput
                    style={styles.input}
                    placeholder="Votre prénom"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Nom *</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color="#FF6B35" />
                  <TextInput
                    style={styles.input}
                    placeholder="Votre nom"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Pays *</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color="#FF6B35" />
                  <TextInput
                    style={styles.input}
                    placeholder="Votre pays de résidence"
                    value={country}
                    onChangeText={setCountry}
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
                    placeholder="+XXX XX XX XX XX ou email@example.com"
                    value={contact}
                    onChangeText={setContact}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.verificationNote}>
                <CheckCircle size={16} color="#28A745" />
                <Text style={styles.verificationText}>
                  La vérification d&apos;identité sera disponible prochainement
                </Text>
              </View>

              <TouchableOpacity
                style={styles.publishButton}
                onPress={handleCreateProfile}
              >
                <Text style={styles.publishButtonText}>Créer mon profil</Text>
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                * Champs obligatoires. En créant un profil, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Publier une demande</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
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

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrer les demandes</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.filterInfoCard}>
                <Text style={styles.filterInfoText}>
                  Utilisez les filtres ci-dessous pour trouver les demandes qui correspondent à vos voyages prévus.
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Pays de départ</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color="#FF6B35" />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Dubai, France, Mali..."
                    value={filterFromCountry}
                    onChangeText={setFilterFromCountry}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Pays de destination</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color="#FF6B35" />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Mali, Côte d'Ivoire..."
                    value={filterToCountry}
                    onChangeText={setFilterToCountry}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Type de produit</Text>
                <View style={styles.inputContainer}>
                  <Box size={20} color="#FF6B35" />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Vêtements, Électronique..."
                    value={filterProductType}
                    onChangeText={setFilterProductType}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.filterActions}>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    clearFilters();
                    setFilterModalVisible(false);
                  }}
                >
                  <Text style={styles.clearButtonText}>Effacer les filtres</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={styles.applyButtonText}>Appliquer</Text>
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
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6C757D',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#FFF5F0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  requestsHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  requestHeaderInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  postedDate: {
    fontSize: 12,
    color: '#6C757D',
  },
  routeInfo: {
    marginBottom: 12,
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  requestDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6C757D',
  },
  description: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  contactButtonSmall: {
    flex: 1,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC3545',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  profileInfoCard: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  profileInfoText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  verificationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  verificationText: {
    flex: 1,
    fontSize: 12,
    color: '#28A745',
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
  searchFilterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
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
    position: 'relative' as const,
  },
  filterButtonActive: {
    backgroundColor: '#FF6B35',
  },
  filterBadge: {
    position: 'absolute' as const,
    top: 4,
    right: 4,
    backgroundColor: '#28A745',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  activeFiltersContainer: {
    marginTop: 12,
  },
  activeFiltersLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 8,
  },
  filterTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTag: {
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  filterTagText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF6B35',
    gap: 4,
  },
  clearFiltersText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  filterInfoCard: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  filterInfoText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  clearButtonText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
