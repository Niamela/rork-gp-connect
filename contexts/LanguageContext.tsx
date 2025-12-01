import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'fr' | 'en';

interface Translations {
  [key: string]: {
    fr: string;
    en: string;
  };
}

const translations: Translations = {
  'home.title': {
    fr: 'GP Connect',
    en: 'GP Connect',
  },
  'home.subtitle': {
    fr: 'Livraison fiable de colis entre l\'Afrique et le monde',
    en: 'Reliable parcel delivery between Africa and the world',
  },
  'home.becomeGP': {
    fr: 'Devenir GP',
    en: 'Become GP',
  },
  'home.becomeGPSubtitle': {
    fr: 'Découvrez comment devenir Grand Passager',
    en: 'Discover how to become a Grand Passenger',
  },
  'home.findGP': {
    fr: 'Trouver votre GP',
    en: 'Find your GP',
  },
  'home.from': {
    fr: 'De (Pays)',
    en: 'From (Country)',
  },
  'home.to': {
    fr: 'Vers (Pays)',
    en: 'To (Country)',
  },
  'home.weight': {
    fr: 'Poids (kg)',
    en: 'Weight (kg)',
  },
  'home.travelDate': {
    fr: 'Date de voyage',
    en: 'Travel date',
  },
  'home.searchGPs': {
    fr: 'Rechercher des GPs',
    en: 'Search GPs',
  },
  'home.featuredGPs': {
    fr: 'GPs en vedette',
    en: 'Featured GPs',
  },
  'home.searchResults': {
    fr: 'Résultats de recherche',
    en: 'Search results',
  },
  'home.gpFound': {
    fr: 'GP{s} trouvé{s}',
    en: 'GP{s} found',
  },
  'home.loading': {
    fr: 'Chargement...',
    en: 'Loading...',
  },
  'home.noGPAvailable': {
    fr: 'Aucun GP disponible pour le moment',
    en: 'No GP available at the moment',
  },
  'home.gpsWillAppear': {
    fr: 'Les GPs apparaîtront ici une fois inscrits',
    en: 'GPs will appear here once registered',
  },
  'home.new': {
    fr: 'Nouveau',
    en: 'New',
  },
  'home.departure': {
    fr: 'Départ',
    en: 'Departure',
  },
  'home.max': {
    fr: 'Max',
    en: 'Max',
  },
  'home.parcelsDelivered': {
    fr: 'Colis livrés',
    en: 'Parcels delivered',
  },
  'home.activeGPs': {
    fr: 'GPs actifs',
    en: 'Active GPs',
  },
  'home.satisfaction': {
    fr: 'Satisfaction',
    en: 'Satisfaction',
  },
  'profile.guest': {
    fr: 'Invité',
    en: 'Guest',
  },
  'profile.connectToStart': {
    fr: 'Connectez-vous pour commencer',
    en: 'Log in to get started',
  },
  'profile.loginOrRegister': {
    fr: 'Se connecter ou S\'inscrire',
    en: 'Log in or Sign up',
  },
  'profile.activeGP': {
    fr: 'Grand Passager Actif',
    en: 'Active Grand Passenger',
  },
  'profile.individual': {
    fr: 'Particulier',
    en: 'Individual',
  },
  'profile.becomeGP': {
    fr: 'Devenir un GP - 10 000 F/mois',
    en: 'Become a GP - 10,000 F/month',
  },
  'profile.parcelsSent': {
    fr: 'Colis envoyés',
    en: 'Parcels sent',
  },
  'profile.rating': {
    fr: 'Note',
    en: 'Rating',
  },
  'profile.travels': {
    fr: 'Voyages',
    en: 'Travels',
  },
  'profile.myTravels': {
    fr: 'Mes voyages',
    en: 'My travels',
  },
  'profile.myActiveTravels': {
    fr: 'Mes voyages actifs',
    en: 'My active travels',
  },
  'profile.viewAll': {
    fr: 'Voir tout',
    en: 'View all',
  },
  'profile.editProfile': {
    fr: 'Modifier le profil',
    en: 'Edit profile',
  },
  'profile.editProfileSub': {
    fr: 'Mettre à jour vos informations personnelles',
    en: 'Update your personal information',
  },
  'profile.notifications': {
    fr: 'Notifications',
    en: 'Notifications',
  },
  'profile.notificationsSub': {
    fr: 'Configurer vos préférences de notification',
    en: 'Configure your notification preferences',
  },
  'profile.settings': {
    fr: 'Paramètres',
    en: 'Settings',
  },
  'profile.settingsSub': {
    fr: 'Préférences de l\'application et confidentialité',
    en: 'App preferences and privacy',
  },
  'profile.helpSupport': {
    fr: 'Aide & Support',
    en: 'Help & Support',
  },
  'profile.helpSupportSub': {
    fr: 'Obtenir de l\'aide ou contacter le support',
    en: 'Get help or contact support',
  },
  'profile.legalContact': {
    fr: 'Légal & Contact',
    en: 'Legal & Contact',
  },
  'profile.privacyPolicy': {
    fr: 'Politique de confidentialité',
    en: 'Privacy Policy',
  },
  'profile.terms': {
    fr: 'Conditions d\'utilisation',
    en: 'Terms of Service',
  },
  'profile.contact': {
    fr: 'Contact',
    en: 'Contact',
  },
  'profile.logout': {
    fr: 'Se déconnecter',
    en: 'Log out',
  },
  'profile.version': {
    fr: 'GP Connect v1.0.0',
    en: 'GP Connect v1.0.0',
  },
  'profile.description': {
    fr: 'Connecter l\'Afrique au monde, un colis à la fois',
    en: 'Connecting Africa to the world, one parcel at a time',
  },
  'gpProfile.verifiedGP': {
    fr: 'Grand Passager Vérifié',
    en: 'Verified Grand Passenger',
  },
  'gpProfile.averageRating': {
    fr: 'Note moyenne',
    en: 'Average rating',
  },
  'gpProfile.parcelsDelivered': {
    fr: 'Colis livrés',
    en: 'Parcels delivered',
  },
  'gpProfile.travels': {
    fr: 'Voyages',
    en: 'Travels',
  },
  'gpProfile.contactInfo': {
    fr: 'Informations de contact',
    en: 'Contact information',
  },
  'gpProfile.contact': {
    fr: 'Contact',
    en: 'Contact',
  },
  'gpProfile.memberSince': {
    fr: 'Membre depuis',
    en: 'Member since',
  },
  'gpProfile.availableTravels': {
    fr: 'Voyages disponibles',
    en: 'Available travels',
  },
  'gpProfile.loadingTravels': {
    fr: 'Chargement des voyages...',
    en: 'Loading travels...',
  },
  'gpProfile.noTravelsAvailable': {
    fr: 'Aucun voyage disponible pour le moment',
    en: 'No travels available at the moment',
  },
  'gpProfile.departure': {
    fr: 'Départ',
    en: 'Departure',
  },
  'gpProfile.max': {
    fr: 'Max',
    en: 'Max',
  },
  'gpProfile.space': {
    fr: 'Espace',
    en: 'Space',
  },
  'gpProfile.price': {
    fr: 'Prix',
    en: 'Price',
  },
  'gpProfile.contactGP': {
    fr: 'Contacter ce GP',
    en: 'Contact this GP',
  },
  'gpProfile.loadingProfile': {
    fr: 'Chargement du profil...',
    en: 'Loading profile...',
  },
  'gpProfile.profileNotFound': {
    fr: 'Profil non trouvé',
    en: 'Profile not found',
  },
  'browse.searchPlaceholder': {
    fr: 'Rechercher des GPs ou des itinéraires...',
    en: 'Search for GPs or routes...',
  },
  'browse.resultsCount': {
    fr: 'voyage{s} trouvé{s}',
    en: 'trip{s} found',
  },
  'browse.reset': {
    fr: 'Réinitialiser',
    en: 'Reset',
  },
  'browse.loading': {
    fr: 'Chargement...',
    en: 'Loading...',
  },
  'browse.noTrips': {
    fr: 'Aucun voyage disponible pour le moment',
    en: 'No trips available at the moment',
  },
  'browse.verified': {
    fr: 'Vérifié',
    en: 'Verified',
  },
  'browse.grandPassenger': {
    fr: 'Grand Passager',
    en: 'Grand Passenger',
  },
  'browse.departure': {
    fr: 'Départ',
    en: 'Departure',
  },
  'browse.max': {
    fr: 'Max',
    en: 'Max',
  },
  'browse.availableSpace': {
    fr: 'Espace disponible',
    en: 'Available space',
  },
  'browse.contact': {
    fr: 'Contacter',
    en: 'Contact',
  },
  'browse.filterTitle': {
    fr: 'Filtres de recherche',
    en: 'Search filters',
  },
  'browse.fromCountry': {
    fr: 'Pays de départ',
    en: 'Departure country',
  },
  'browse.toCountry': {
    fr: 'Pays d\'arrivée',
    en: 'Arrival country',
  },
  'browse.minWeight': {
    fr: 'Poids minimum disponible (kg)',
    en: 'Minimum available weight (kg)',
  },
  'browse.departureDate': {
    fr: 'Date de départ',
    en: 'Departure date',
  },
  'browse.maxPrice': {
    fr: 'Prix maximum (F/kg)',
    en: 'Maximum price (F/kg)',
  },
  'browse.clearFilters': {
    fr: 'Réinitialiser',
    en: 'Reset',
  },
  'browse.applyFilters': {
    fr: 'Appliquer',
    en: 'Apply',
  },
  'messages.title': {
    fr: 'Messages',
    en: 'Messages',
  },
  'messages.subtitle': {
    fr: 'Vos conversations avec les GPs et particuliers',
    en: 'Your conversations with GPs and individuals',
  },
  'messages.noMessages': {
    fr: 'Aucun message',
    en: 'No messages',
  },
  'messages.noMessagesDesc': {
    fr: 'Vos conversations apparaîtront ici une fois que vous aurez contacté un GP ou un particulier',
    en: 'Your conversations will appear here once you have contacted a GP or individual',
  },
  'messages.individual': {
    fr: 'Particulier',
    en: 'Individual',
  },
  'messages.loginRequired': {
    fr: 'Connectez-vous pour accéder à vos messages',
    en: 'Log in to access your messages',
  },
  'messages.createProfile': {
    fr: 'Créer un profil',
    en: 'Create profile',
  },
  'messages.writeMessage': {
    fr: 'Écrivez votre message...',
    en: 'Write your message...',
  },
  'messages.yesterday': {
    fr: 'Hier',
    en: 'Yesterday',
  },
  'requests.title': {
    fr: 'Demandes de GP',
    en: 'GP Requests',
  },
  'requests.subtitle': {
    fr: 'Publiez votre demande et les GPs vous contacteront',
    en: 'Post your request and GPs will contact you',
  },
  'requests.search': {
    fr: 'Rechercher...',
    en: 'Search...',
  },
  'requests.activeFilters': {
    fr: 'Filtres actifs:',
    en: 'Active filters:',
  },
  'requests.clear': {
    fr: 'Effacer',
    en: 'Clear',
  },
  'requests.howItWorks': {
    fr: 'Comment ça marche ?',
    en: 'How it works?',
  },
  'requests.step1': {
    fr: '1. Publiez votre demande avec les détails de votre envoi',
    en: '1. Post your request with your shipment details',
  },
  'requests.step2': {
    fr: '2. Les GPs disponibles verront votre annonce',
    en: '2. Available GPs will see your listing',
  },
  'requests.step3': {
    fr: '3. Ils vous contacteront directement pour discuter',
    en: '3. They will contact you directly to discuss',
  },
  'requests.recentRequests': {
    fr: 'Demandes récentes',
    en: 'Recent requests',
  },
  'requests.resultsFound': {
    fr: 'résultat{s} trouvé{s}',
    en: 'result{s} found',
  },
  'requests.noResults': {
    fr: 'Aucune demande ne correspond à vos critères',
    en: 'No requests match your criteria',
  },
  'requests.noRequests': {
    fr: 'Aucune demande pour le moment',
    en: 'No requests at the moment',
  },
  'requests.contact': {
    fr: 'Contacter',
    en: 'Contact',
  },
  'requests.delete': {
    fr: 'Supprimer',
    en: 'Delete',
  },
  'requests.publishRequest': {
    fr: 'Publier une demande',
    en: 'Post a request',
  },
  'requests.from': {
    fr: 'De (Pays)',
    en: 'From (Country)',
  },
  'requests.to': {
    fr: 'Vers (Pays)',
    en: 'To (Country)',
  },
  'requests.weight': {
    fr: 'Poids approximatif (kg)',
    en: 'Approximate weight (kg)',
  },
  'requests.date': {
    fr: 'Date souhaitée',
    en: 'Desired date',
  },
  'requests.productType': {
    fr: 'Type de produit',
    en: 'Product type',
  },
  'requests.description': {
    fr: 'Description (optionnel)',
    en: 'Description (optional)',
  },
  'requests.contactInfo': {
    fr: 'Contact (Téléphone ou Email)',
    en: 'Contact (Phone or Email)',
  },
  'requests.publish': {
    fr: 'Publier la demande',
    en: 'Publish request',
  },
  'requests.filterTitle': {
    fr: 'Filtrer les demandes',
    en: 'Filter requests',
  },
  'requests.filterInfo': {
    fr: 'Utilisez les filtres ci-dessous pour trouver les demandes qui correspondent à vos voyages prévus.',
    en: 'Use the filters below to find requests that match your planned trips.',
  },
  'requests.applyFilters': {
    fr: 'Appliquer',
    en: 'Apply',
  },
  'settings.title': {
    fr: 'Paramètres',
    en: 'Settings',
  },
  'settings.appearance': {
    fr: 'Apparence',
    en: 'Appearance',
  },
  'settings.darkMode': {
    fr: 'Mode sombre',
    en: 'Dark mode',
  },
  'settings.darkModeDesc': {
    fr: 'Activer le thème sombre',
    en: 'Enable dark theme',
  },
  'settings.language': {
    fr: 'Langue',
    en: 'Language',
  },
  'settings.languageFr': {
    fr: 'Français',
    en: 'French',
  },
  'settings.languageEn': {
    fr: 'Anglais',
    en: 'English',
  },
  'settings.dataStorage': {
    fr: 'Données et stockage',
    en: 'Data and storage',
  },
  'settings.autoDownload': {
    fr: 'Téléchargement automatique',
    en: 'Auto-download',
  },
  'settings.autoDownloadDesc': {
    fr: 'Télécharger automatiquement les images',
    en: 'Automatically download images',
  },
  'settings.clearCache': {
    fr: 'Vider le cache',
    en: 'Clear cache',
  },
  'settings.clearCacheDesc': {
    fr: 'Libérer de l\'espace de stockage',
    en: 'Free up storage space',
  },
  'settings.privacySecurity': {
    fr: 'Confidentialité et sécurité',
    en: 'Privacy and security',
  },
  'settings.privacyPolicy': {
    fr: 'Politique de confidentialité',
    en: 'Privacy Policy',
  },
  'settings.privacyPolicyDesc': {
    fr: 'Voir notre politique de confidentialité',
    en: 'View our privacy policy',
  },
  'settings.accountSecurity': {
    fr: 'Sécurité du compte',
    en: 'Account security',
  },
  'settings.accountSecurityDesc': {
    fr: 'Gérer la sécurité de votre compte',
    en: 'Manage your account security',
  },
  'settings.dangerZone': {
    fr: 'Zone dangereuse',
    en: 'Danger zone',
  },
  'settings.deleteAccount': {
    fr: 'Supprimer le compte',
    en: 'Delete account',
  },
  'settings.deleteAccountDesc': {
    fr: 'Supprimer définitivement votre compte',
    en: 'Permanently delete your account',
  },
  'settings.deleteAccountWarning': {
    fr: '⚠️ La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.',
    en: '⚠️ Deleting your account is irreversible. All your data will be permanently deleted.',
  },
  'common.verified': {
    fr: 'Vérifié',
    en: 'Verified',
  },
  'common.loading': {
    fr: 'Chargement...',
    en: 'Loading...',
  },
  'common.cancel': {
    fr: 'Annuler',
    en: 'Cancel',
  },
  'common.delete': {
    fr: 'Supprimer',
    en: 'Delete',
  },
  'common.success': {
    fr: 'Succès',
    en: 'Success',
  },
  'common.error': {
    fr: 'Erreur',
    en: 'Error',
  },
  'common.ok': {
    fr: 'OK',
    en: 'OK',
  },
  'common.apply': {
    fr: 'Appliquer',
    en: 'Apply',
  },
  'common.reset': {
    fr: 'Réinitialiser',
    en: 'Reset',
  },
  'tabs.home': {
    fr: 'Accueil',
    en: 'Home',
  },
  'tabs.browse': {
    fr: 'Parcourir',
    en: 'Browse',
  },
  'tabs.requests': {
    fr: 'Annonces',
    en: 'Ads',
  },
  'tabs.messages': {
    fr: 'Messages',
    en: 'Messages',
  },
  'tabs.profile': {
    fr: 'Profil',
    en: 'Profile',
  },
  'becomeGP.headerTitle': {
    fr: 'Devenir Grand Passager',
    en: 'Become Grand Passenger',
  },
  'becomeGP.headerSubtitle': {
    fr: 'Transformez vos voyages en opportunité et aidez les autres à envoyer leurs colis',
    en: 'Turn your trips into opportunities and help others send their parcels',
  },
  'becomeGP.pricePerMonth': {
    fr: '/ mois',
    en: '/ month',
  },
  'becomeGP.priceDescription': {
    fr: 'Sans engagement • Annulez à tout moment',
    en: 'No commitment • Cancel anytime',
  },
  'becomeGP.howItWorks': {
    fr: 'Comment ça marche ?',
    en: 'How does it work?',
  },
  'becomeGP.step1Title': {
    fr: 'Créez votre profil GP',
    en: 'Create your GP profile',
  },
  'becomeGP.step1Desc': {
    fr: 'Remplissez vos informations personnelles et professionnelles',
    en: 'Fill in your personal and professional information',
  },
  'becomeGP.step2Title': {
    fr: 'Souscrivez à l\'abonnement',
    en: 'Subscribe to the plan',
  },
  'becomeGP.step2Desc': {
    fr: 'Abonnement mensuel de 10 000 F pour accéder à toutes les fonctionnalités',
    en: 'Monthly subscription of 10,000 F to access all features',
  },
  'becomeGP.step3Title': {
    fr: 'Publiez vos voyages',
    en: 'Publish your trips',
  },
  'becomeGP.step3Desc': {
    fr: 'Partagez vos dates de voyage et l\'espace disponible',
    en: 'Share your travel dates and available space',
  },
  'becomeGP.step4Title': {
    fr: 'Recevez des demandes',
    en: 'Receive requests',
  },
  'becomeGP.step4Desc': {
    fr: 'Les particuliers vous contactent pour leurs besoins d\'envoi',
    en: 'Individuals contact you for their shipping needs',
  },
  'becomeGP.benefitsIncluded': {
    fr: 'Avantages inclus',
    en: 'Benefits included',
  },
  'becomeGP.benefit1': {
    fr: 'Publiez autant de voyages que vous souhaitez',
    en: 'Publish as many trips as you want',
  },
  'becomeGP.benefit2': {
    fr: 'Accédez à toutes les demandes des particuliers',
    en: 'Access all individual requests',
  },
  'becomeGP.benefit3': {
    fr: 'Messagerie directe avec les clients',
    en: 'Direct messaging with customers',
  },
  'becomeGP.benefit4': {
    fr: 'Profil vérifié et badge GP',
    en: 'Verified profile and GP badge',
  },
  'becomeGP.benefit5': {
    fr: 'Visibilité accrue dans les recherches',
    en: 'Increased visibility in searches',
  },
  'becomeGP.benefit6': {
    fr: 'Support prioritaire',
    en: 'Priority support',
  },
  'becomeGP.benefit7': {
    fr: 'Gestion simplifiée de vos annonces',
    en: 'Simplified management of your listings',
  },
  'becomeGP.differenceTitle': {
    fr: 'Quelle est la différence ?',
    en: 'What is the difference?',
  },
  'becomeGP.individualLabel': {
    fr: 'Particulier',
    en: 'Individual',
  },
  'becomeGP.individualDesc': {
    fr: '• Publier des demandes d\'envoi gratuitement\n• Voir tous les voyages disponibles\n• Recevoir des messages des GPs',
    en: '• Post shipping requests for free\n• View all available trips\n• Receive messages from GPs',
  },
  'becomeGP.gpLabel': {
    fr: 'Grand Passager (GP)',
    en: 'Grand Passenger (GP)',
  },
  'becomeGP.gpDesc': {
    fr: '• Publier des voyages illimités\n• Contacter toutes les demandes\n• Badge vérifié et profil visible\n• Monétiser vos voyages',
    en: '• Publish unlimited trips\n• Contact all requests\n• Verified badge and visible profile\n• Monetize your trips',
  },
  'becomeGP.getStarted': {
    fr: 'Commencer maintenant',
    en: 'Get started now',
  },
  'createProfile.modalTitle': {
    fr: 'Créer votre profil',
    en: 'Create your profile',
  },
  'createProfile.infoText': {
    fr: 'Pour publier une demande, vous devez créer un profil gratuit. Cela permet aux GPs de vous identifier et de vous contacter.',
    en: 'To post a request, you must create a free profile. This allows GPs to identify and contact you.',
  },
  'createProfile.firstName': {
    fr: 'Prénom',
    en: 'First name',
  },
  'createProfile.firstNamePlaceholder': {
    fr: 'Votre prénom',
    en: 'Your first name',
  },
  'createProfile.lastName': {
    fr: 'Nom',
    en: 'Last name',
  },
  'createProfile.lastNamePlaceholder': {
    fr: 'Votre nom',
    en: 'Your last name',
  },
  'createProfile.country': {
    fr: 'Pays',
    en: 'Country',
  },
  'createProfile.countryPlaceholder': {
    fr: 'Votre pays de résidence',
    en: 'Your country of residence',
  },
  'createProfile.contact': {
    fr: 'Contact (Téléphone ou Email)',
    en: 'Contact (Phone or Email)',
  },
  'createProfile.contactPlaceholder': {
    fr: '+XXX XX XX XX XX ou email@example.com',
    en: '+XXX XX XX XX XX or email@example.com',
  },
  'createProfile.verificationNote': {
    fr: 'La vérification d\'identité sera disponible prochainement',
    en: 'Identity verification will be available soon',
  },
  'createProfile.createButton': {
    fr: 'Créer mon profil',
    en: 'Create my profile',
  },
  'createProfile.disclaimer': {
    fr: '* Champs obligatoires. En créant un profil, vous acceptez nos conditions d\'utilisation et notre politique de confidentialité.',
    en: '* Required fields. By creating a profile, you accept our terms of service and privacy policy.',
  },
  'createProfile.required': {
    fr: '*',
    en: '*',
  },
  'createProfile.errorAllFields': {
    fr: 'Veuillez remplir tous les champs obligatoires',
    en: 'Please fill in all required fields',
  },
  'createProfile.errorTitle': {
    fr: 'Erreur',
    en: 'Error',
  },
  'createProfile.successTitle': {
    fr: 'Profil créé',
    en: 'Profile created',
  },
  'createProfile.successMessage': {
    fr: 'Votre profil a été créé avec succès. Vous pouvez maintenant publier des demandes.',
    en: 'Your profile has been created successfully. You can now post requests.',
  },
  'createProfile.errorMessage': {
    fr: 'Impossible de créer le profil. Veuillez réessayer.',
    en: 'Unable to create profile. Please try again.',
  },
  'createRequest.modalTitle': {
    fr: 'Publier une demande',
    en: 'Post a request',
  },
  'createRequest.fromCountry': {
    fr: 'De (Pays)',
    en: 'From (Country)',
  },
  'createRequest.fromPlaceholder': {
    fr: 'Ex: Dubai',
    en: 'E.g.: Dubai',
  },
  'createRequest.toCountry': {
    fr: 'Vers (Pays)',
    en: 'To (Country)',
  },
  'createRequest.toPlaceholder': {
    fr: 'Ex: Mali',
    en: 'E.g.: Mali',
  },
  'createRequest.weight': {
    fr: 'Poids approximatif (kg)',
    en: 'Approximate weight (kg)',
  },
  'createRequest.weightPlaceholder': {
    fr: 'Ex: 15',
    en: 'E.g.: 15',
  },
  'createRequest.date': {
    fr: 'Date souhaitée',
    en: 'Desired date',
  },
  'createRequest.datePlaceholder': {
    fr: 'Ex: 25 Jan 2025',
    en: 'E.g.: 25 Jan 2025',
  },
  'createRequest.productType': {
    fr: 'Type de produit',
    en: 'Product type',
  },
  'createRequest.productTypePlaceholder': {
    fr: 'Ex: Vêtements, Électronique, Documents...',
    en: 'E.g.: Clothing, Electronics, Documents...',
  },
  'createRequest.contact': {
    fr: 'Contact (Téléphone ou Email)',
    en: 'Contact (Phone or Email)',
  },
  'createRequest.contactPlaceholder': {
    fr: 'Ex: +223 XX XX XX XX',
    en: 'E.g.: +223 XX XX XX XX',
  },
  'createRequest.description': {
    fr: 'Description (optionnel)',
    en: 'Description (optional)',
  },
  'createRequest.descriptionPlaceholder': {
    fr: 'Décrivez votre colis et vos besoins...',
    en: 'Describe your parcel and your needs...',
  },
  'createRequest.publishButton': {
    fr: 'Publier la demande',
    en: 'Publish request',
  },
  'createRequest.disclaimer': {
    fr: '* Champs obligatoires. Votre demande sera visible par tous les GPs.',
    en: '* Required fields. Your request will be visible to all GPs.',
  },
  'createRequest.errorAllFields': {
    fr: 'Veuillez remplir tous les champs obligatoires',
    en: 'Please fill in all required fields',
  },
  'createRequest.errorTitle': {
    fr: 'Erreur',
    en: 'Error',
  },
  'createRequest.errorNoProfile': {
    fr: 'Profil utilisateur introuvable',
    en: 'User profile not found',
  },
  'createRequest.errorMessage': {
    fr: 'Impossible de publier la demande. Veuillez réessayer.',
    en: 'Unable to publish request. Please try again.',
  },
  'createRequest.successTitle': {
    fr: 'Succès',
    en: 'Success',
  },
  'createRequest.successMessage': {
    fr: 'Votre demande a été publiée avec succès!',
    en: 'Your request has been published successfully!',
  },
  'createRequest.required': {
    fr: '*',
    en: '*',
  },
  'createGPProfile.headerTitle': {
    fr: 'Devenir GP',
    en: 'Become GP',
  },
  'createGPProfile.headerSubtitle': {
    fr: 'Créez votre profil et commencez à publier vos voyages',
    en: 'Create your profile and start publishing your trips',
  },
  'createGPProfile.profilePhoto': {
    fr: 'Photo de profil',
    en: 'Profile photo',
  },
  'createGPProfile.photoHint': {
    fr: 'Photo qui apparaîtra dans vos annonces',
    en: 'Photo that will appear in your listings',
  },
  'createGPProfile.infoTitle': {
    fr: 'Abonnement mensuel: 10 000 F',
    en: 'Monthly subscription: 10,000 F',
  },
  'createGPProfile.infoText': {
    fr: 'Publiez autant de voyages que vous souhaitez et recevez des demandes de particuliers',
    en: 'Publish as many trips as you want and receive requests from individuals',
  },
  'createGPProfile.personalInfo': {
    fr: 'Informations personnelles',
    en: 'Personal information',
  },
  'createGPProfile.firstName': {
    fr: 'Prénom',
    en: 'First name',
  },
  'createGPProfile.firstNamePlaceholder': {
    fr: 'Entrez votre prénom',
    en: 'Enter your first name',
  },
  'createGPProfile.lastName': {
    fr: 'Nom',
    en: 'Last name',
  },
  'createGPProfile.lastNamePlaceholder': {
    fr: 'Entrez votre nom',
    en: 'Enter your last name',
  },
  'createGPProfile.country': {
    fr: 'Pays',
    en: 'Country',
  },
  'createGPProfile.countryPlaceholder': {
    fr: 'Entrez votre pays',
    en: 'Enter your country',
  },
  'createGPProfile.contact': {
    fr: 'Contact (Téléphone)',
    en: 'Contact (Phone)',
  },
  'createGPProfile.contactPlaceholder': {
    fr: '+225 XX XX XX XX XX',
    en: '+225 XX XX XX XX XX',
  },
  'createGPProfile.password': {
    fr: 'Mot de passe',
    en: 'Password',
  },
  'createGPProfile.passwordPlaceholder': {
    fr: 'Mot de passe (min. 6 caractères)',
    en: 'Password (min. 6 characters)',
  },
  'createGPProfile.createButton': {
    fr: 'Créer mon profil GP',
    en: 'Create my GP profile',
  },
  'createGPProfile.disclaimer': {
    fr: 'En créant un profil GP, vous acceptez nos conditions d\'utilisation et notre politique de confidentialité.',
    en: 'By creating a GP profile, you accept our terms of service and privacy policy.',
  },
  'createGPProfile.termsLink': {
    fr: 'conditions d\'utilisation',
    en: 'terms of service',
  },
  'createGPProfile.privacyLink': {
    fr: 'politique de confidentialité',
    en: 'privacy policy',
  },
  'createGPProfile.required': {
    fr: '*',
    en: '*',
  },
  'createGPProfile.errorAllFields': {
    fr: 'Veuillez remplir tous les champs obligatoires',
    en: 'Please fill in all required fields',
  },
  'createGPProfile.errorTitle': {
    fr: 'Erreur',
    en: 'Error',
  },
  'createGPProfile.errorMessage': {
    fr: 'Une erreur est survenue lors de la création du profil',
    en: 'An error occurred while creating the profile',
  },
  'createGPProfile.successTitle': {
    fr: 'Succès',
    en: 'Success',
  },
  'createGPProfile.successMessage': {
    fr: 'Votre profil GP a été créé avec succès! Vous pouvez maintenant publier vos voyages.',
    en: 'Your GP profile has been created successfully! You can now publish your trips.',
  },
  'createGPProfile.permissionRequired': {
    fr: 'Permission requise',
    en: 'Permission required',
  },
  'createGPProfile.permissionMessage': {
    fr: 'Veuillez autoriser l\'accès à la galerie pour sélectionner une photo',
    en: 'Please allow access to the gallery to select a photo',
  },
  'createGPProfile.imageError': {
    fr: 'Impossible de sélectionner l\'image',
    en: 'Unable to select image',
  },
  'addButton.profileRequired': {
    fr: 'Profil requis',
    en: 'Profile required',
  },
  'addButton.profileRequiredMessage': {
    fr: 'Vous devez créer un profil gratuit pour publier une demande.',
    en: 'You must create a free profile to post a request.',
  },
  'addButton.cancel': {
    fr: 'Annuler',
    en: 'Cancel',
  },
  'addButton.createProfile': {
    fr: 'Créer un profil',
    en: 'Create a profile',
  },
}

const LANGUAGE_STORAGE_KEY = '@gp_connect_language';

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const [language, setLanguage] = useState<Language>('fr');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === 'fr' || stored === 'en') {
          setLanguage(stored);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = useCallback(async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguage(newLanguage);
      console.log('[LanguageContext] Language changed to:', newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  const t = useCallback((key: string, replacements?: Record<string, string>) => {
    const translation = translations[key];
    if (!translation) {
      console.warn('[LanguageContext] Missing translation for:', key);
      return key;
    }
    
    let text = translation[language] || translation['fr'];
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replace(`{${placeholder}}`, value);
      });
    }
    
    return text;
  }, [language]);

  return useMemo(() => ({
    language,
    changeLanguage,
    t,
    isLoaded,
  }), [language, changeLanguage, t, isLoaded]);
});
