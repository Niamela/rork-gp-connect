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
    en: 'Requests',
  },
  'tabs.messages': {
    fr: 'Messages',
    en: 'Messages',
  },
  'tabs.profile': {
    fr: 'Profil',
    en: 'Profile',
  },
  'browse.searchPlaceholder': {
    fr: 'Rechercher des GPs ou des itinéraires...',
    en: 'Search for GPs or routes...',
  },
  'browse.resultsCount': {
    fr: '{count} voyage{s} trouvé{s}',
    en: '{count} trip{s} found',
  },
  'browse.reset': {
    fr: 'Réinitialiser',
    en: 'Reset',
  },
  'browse.loading': {
    fr: 'Chargement...',
    en: 'Loading...',
  },
  'browse.noTravels': {
    fr: 'Aucun voyage disponible pour le moment',
    en: 'No trips available at the moment',
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
  'browse.apply': {
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
  'messages.noMessagesText': {
    fr: 'Vos conversations apparaîtront ici une fois que vous aurez contacté un GP ou un particulier',
    en: 'Your conversations will appear here once you contact a GP or individual',
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
  'messages.individual': {
    fr: 'Particulier',
    en: 'Individual',
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
  'requests.from': {
    fr: 'De',
    en: 'From',
  },
  'requests.to': {
    fr: 'Vers',
    en: 'To',
  },
  'requests.clear': {
    fr: 'Effacer',
    en: 'Clear',
  },
  'requests.howItWorks': {
    fr: 'Comment ça marche ?',
    en: 'How does it work?',
  },
  'requests.howItWorksText': {
    fr: '1. Publiez votre demande avec les détails de votre envoi\n2. Les GPs disponibles verront votre annonce\n3. Ils vous contacteront directement pour discuter',
    en: '1. Post your request with your shipment details\n2. Available GPs will see your ad\n3. They will contact you directly to discuss',
  },
  'requests.recentRequests': {
    fr: 'Demandes récentes ({count})',
    en: 'Recent requests ({count})',
  },
  'requests.resultsFound': {
    fr: '{count} résultat{s} trouvé{s}',
    en: '{count} result{s} found',
  },
  'requests.noRequests': {
    fr: 'Aucune demande pour le moment',
    en: 'No requests at the moment',
  },
  'requests.noResults': {
    fr: 'Aucune demande ne correspond à vos critères',
    en: 'No requests match your criteria',
  },
  'requests.delete': {
    fr: 'Supprimer',
    en: 'Delete',
  },
  'requests.publishRequest': {
    fr: 'Publier une demande',
    en: 'Post a request',
  },
  'requests.createProfile': {
    fr: 'Créer votre profil',
    en: 'Create your profile',
  },
  'requests.createProfileText': {
    fr: 'Pour publier une demande, vous devez créer un profil gratuit. Cela permet aux GPs de vous identifier et de vous contacter.',
    en: 'To post a request, you must create a free profile. This allows GPs to identify and contact you.',
  },
  'requests.firstName': {
    fr: 'Prénom',
    en: 'First name',
  },
  'requests.lastName': {
    fr: 'Nom',
    en: 'Last name',
  },
  'requests.country': {
    fr: 'Pays',
    en: 'Country',
  },
  'requests.contactInfo': {
    fr: 'Contact (Téléphone ou Email)',
    en: 'Contact (Phone or Email)',
  },
  'requests.weight': {
    fr: 'Poids approximatif (kg)',
    en: 'Approximate weight (kg)',
  },
  'requests.desiredDate': {
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
  'requests.publish': {
    fr: 'Publier la demande',
    en: 'Post request',
  },
  'requests.createProfileButton': {
    fr: 'Créer mon profil',
    en: 'Create my profile',
  },
  'requests.requiredFields': {
    fr: '* Champs obligatoires',
    en: '* Required fields',
  },
  'requests.filterTitle': {
    fr: 'Filtrer les demandes',
    en: 'Filter requests',
  },
  'requests.filterText': {
    fr: 'Utilisez les filtres ci-dessous pour trouver les demandes qui correspondent à vos voyages prévus.',
    en: 'Use the filters below to find requests that match your planned trips.',
  },
  'requests.clearFilters': {
    fr: 'Effacer les filtres',
    en: 'Clear filters',
  },
  'auth.login': {
    fr: 'Connexion',
    en: 'Login',
  },
  'auth.signup': {
    fr: 'Inscription',
    en: 'Sign up',
  },
  'auth.emailOrPhone': {
    fr: 'Email ou Téléphone',
    en: 'Email or Phone',
  },
  'auth.password': {
    fr: 'Mot de passe',
    en: 'Password',
  },
  'auth.firstName': {
    fr: 'Prénom',
    en: 'First name',
  },
  'auth.lastName': {
    fr: 'Nom',
    en: 'Last name',
  },
  'auth.country': {
    fr: 'Pays',
    en: 'Country',
  },
  'auth.signIn': {
    fr: 'Se connecter',
    en: 'Sign in',
  },
  'auth.createAccount': {
    fr: 'Créer un compte',
    en: 'Create account',
  },
  'auth.loading': {
    fr: 'Chargement...',
    en: 'Loading...',
  },
  'auth.connectingAfrica': {
    fr: 'Connecter l\'Afrique au monde',
    en: 'Connecting Africa to the world',
  },
  'auth.createAccountInfo': {
    fr: 'En créant un compte, vous pourrez publier des demandes d\'envoi de colis gratuitement.',
    en: 'By creating an account, you can post parcel requests for free.',
  },
  'auth.loginInfo': {
    fr: 'Entrez votre email/téléphone et mot de passe pour vous connecter.',
    en: 'Enter your email/phone and password to log in.',
  },
  'auth.continueWithoutAccount': {
    fr: 'Continuer sans compte',
    en: 'Continue without account',
  },
  'becomeGP.title': {
    fr: 'Devenir Grand Passager',
    en: 'Become Grand Passenger',
  },
  'becomeGP.subtitle': {
    fr: 'Transformez vos voyages en opportunité et aidez les autres à envoyer leurs colis',
    en: 'Transform your travels into opportunities and help others send their packages',
  },
  'becomeGP.pricePerMonth': {
    fr: '/ mois',
    en: '/ month',
  },
  'becomeGP.noCommitment': {
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
    en: 'Post your trips',
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
    en: 'Post as many trips as you want',
  },
  'becomeGP.benefit2': {
    fr: 'Accédez à toutes les demandes des particuliers',
    en: 'Access all individual requests',
  },
  'becomeGP.benefit3': {
    fr: 'Messagerie directe avec les clients',
    en: 'Direct messaging with clients',
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
    en: 'Simplified ad management',
  },
  'becomeGP.differencesTitle': {
    fr: 'Quelle est la différence ?',
    en: 'What is the difference?',
  },
  'becomeGP.individual': {
    fr: 'Particulier',
    en: 'Individual',
  },
  'becomeGP.individualDesc': {
    fr: '• Publier des demandes d\'envoi gratuitement\n• Voir tous les voyages disponibles\n• Recevoir des messages des GPs',
    en: '• Post shipping requests for free\n• View all available trips\n• Receive messages from GPs',
  },
  'becomeGP.gpDesc': {
    fr: '• Publier des voyages illimités\n• Contacter toutes les demandes\n• Badge vérifié et profil visible\n• Monétiser vos voyages',
    en: '• Post unlimited trips\n• Contact all requests\n• Verified badge and visible profile\n• Monetize your trips',
  },
  'becomeGP.startNow': {
    fr: 'Commencer maintenant',
    en: 'Start now',
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
  'settings.languageFrench': {
    fr: 'Français',
    en: 'French',
  },
  'settings.languageEnglish': {
    fr: 'Anglais',
    en: 'English',
  },
  'settings.dataStorage': {
    fr: 'Données et stockage',
    en: 'Data and storage',
  },
  'settings.autoDownload': {
    fr: 'Téléchargement automatique',
    en: 'Auto download',
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
    en: 'Privacy policy',
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
  'settings.deleteWarning': {
    fr: '⚠️ La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.',
    en: '⚠️ Account deletion is irreversible. All your data will be permanently deleted.',
  },
  'createGP.title': {
    fr: 'Devenir GP',
    en: 'Become GP',
  },
  'createGP.subtitle': {
    fr: 'Créez votre profil et commencez à publier vos voyages',
    en: 'Create your profile and start posting your trips',
  },
  'createGP.profilePhoto': {
    fr: 'Photo de profil',
    en: 'Profile photo',
  },
  'createGP.photoHint': {
    fr: 'Photo qui apparaîtra dans vos annonces',
    en: 'Photo that will appear in your ads',
  },
  'createGP.monthlySubscription': {
    fr: 'Abonnement mensuel: 10 000 F',
    en: 'Monthly subscription: 10,000 F',
  },
  'createGP.subscriptionDesc': {
    fr: 'Publiez autant de voyages que vous souhaitez et recevez des demandes de particuliers',
    en: 'Post as many trips as you want and receive requests from individuals',
  },
  'createGP.personalInfo': {
    fr: 'Informations personnelles',
    en: 'Personal information',
  },
  'createGP.firstNamePlaceholder': {
    fr: 'Entrez votre prénom',
    en: 'Enter your first name',
  },
  'createGP.lastNamePlaceholder': {
    fr: 'Entrez votre nom',
    en: 'Enter your last name',
  },
  'createGP.countryPlaceholder': {
    fr: 'Entrez votre pays',
    en: 'Enter your country',
  },
  'createGP.contactLabel': {
    fr: 'Contact (Téléphone)',
    en: 'Contact (Phone)',
  },
  'createGP.contactPlaceholder': {
    fr: '+225 XX XX XX XX XX',
    en: '+225 XX XX XX XX XX',
  },
  'createGP.passwordLabel': {
    fr: 'Mot de passe',
    en: 'Password',
  },
  'createGP.passwordPlaceholder': {
    fr: 'Mot de passe (min. 6 caractères)',
    en: 'Password (min. 6 characters)',
  },
  'createGP.createProfile': {
    fr: 'Créer mon profil GP',
    en: 'Create my GP profile',
  },
  'createGP.disclaimer': {
    fr: 'En créant un profil GP, vous acceptez nos',
    en: 'By creating a GP profile, you accept our',
  },
  'createGP.termsOfService': {
    fr: 'conditions d\'utilisation',
    en: 'terms of service',
  },
  'createGP.and': {
    fr: 'et notre',
    en: 'and our',
  },
  'createGP.privacyPolicy': {
    fr: 'politique de confidentialité',
    en: 'privacy policy',
  },
  'editProfile.title': {
    fr: 'Modifier le profil',
    en: 'Edit profile',
  },
  'editProfile.profilePhoto': {
    fr: 'Photo de profil',
    en: 'Profile photo',
  },
  'editProfile.tapToChange': {
    fr: 'Appuyez pour changer la photo',
    en: 'Tap to change photo',
  },
  'editProfile.delete': {
    fr: 'Supprimer',
    en: 'Delete',
  },
  'editProfile.personalInfo': {
    fr: 'Informations personnelles',
    en: 'Personal information',
  },
  'editProfile.firstNamePlaceholder': {
    fr: 'Entrez votre prénom',
    en: 'Enter your first name',
  },
  'editProfile.lastNamePlaceholder': {
    fr: 'Entrez votre nom',
    en: 'Enter your last name',
  },
  'editProfile.countryPlaceholder': {
    fr: 'Entrez votre pays',
    en: 'Enter your country',
  },
  'editProfile.contactPlaceholder': {
    fr: 'Email ou téléphone',
    en: 'Email or phone',
  },
  'editProfile.requiredFields': {
    fr: '* Tous les champs sont obligatoires',
    en: '* All fields are required',
  },
  'editProfile.saveChanges': {
    fr: 'Enregistrer les modifications',
    en: 'Save changes',
  },
  'editProfile.saving': {
    fr: 'Enregistrement...',
    en: 'Saving...',
  },
  'notifications.title': {
    fr: 'Notifications',
    en: 'Notifications',
  },
  'notifications.channels': {
    fr: 'Canaux de notification',
    en: 'Notification channels',
  },
  'notifications.push': {
    fr: 'Notifications push',
    en: 'Push notifications',
  },
  'notifications.pushDesc': {
    fr: 'Recevoir des notifications sur votre appareil',
    en: 'Receive notifications on your device',
  },
  'notifications.email': {
    fr: 'Notifications par email',
    en: 'Email notifications',
  },
  'notifications.emailDesc': {
    fr: 'Recevoir des notifications par email',
    en: 'Receive notifications by email',
  },
  'notifications.types': {
    fr: 'Types de notifications',
    en: 'Notification types',
  },
  'notifications.newRequests': {
    fr: 'Nouvelles demandes',
    en: 'New requests',
  },
  'notifications.newRequestsDesc': {
    fr: 'Alertes pour les nouvelles demandes d\'envoi',
    en: 'Alerts for new shipping requests',
  },
  'notifications.messages': {
    fr: 'Messages',
    en: 'Messages',
  },
  'notifications.messagesDesc': {
    fr: 'Notifications pour les nouveaux messages',
    en: 'Notifications for new messages',
  },
  'notifications.shipmentTracking': {
    fr: 'Suivi des envois',
    en: 'Shipment tracking',
  },
  'notifications.shipmentTrackingDesc': {
    fr: 'Mises à jour sur l\'état de vos colis',
    en: 'Updates on your package status',
  },
  'notifications.reviews': {
    fr: 'Avis et notes',
    en: 'Reviews and ratings',
  },
  'notifications.reviewsDesc': {
    fr: 'Notifications pour les nouveaux avis',
    en: 'Notifications for new reviews',
  },
  'notifications.info': {
    fr: '💡 Vous pouvez personnaliser vos préférences de notification à tout moment. Les notifications vous aident à rester informé de l\'activité importante.',
    en: '💡 You can customize your notification preferences at any time. Notifications help you stay informed of important activity.',
  },
  'helpSupport.title': {
    fr: 'Aide & Support',
    en: 'Help & Support',
  },
  'helpSupport.contactUs': {
    fr: 'Contactez-nous',
    en: 'Contact us',
  },
  'helpSupport.liveChat': {
    fr: 'Chat en direct',
    en: 'Live chat',
  },
  'helpSupport.liveChatDesc': {
    fr: 'Discutez avec notre équipe',
    en: 'Chat with our team',
  },
  'helpSupport.emailDesc': {
    fr: 'support@gpconnect.com',
    en: 'support@gpconnect.com',
  },
  'helpSupport.faq': {
    fr: 'Questions fréquentes',
    en: 'Frequently asked questions',
  },
  'helpSupport.resources': {
    fr: 'Ressources',
    en: 'Resources',
  },
  'helpSupport.userGuide': {
    fr: 'Guide d\'utilisation',
    en: 'User guide',
  },
  'helpSupport.videoTutorials': {
    fr: 'Tutoriels vidéo',
    en: 'Video tutorials',
  },
  'helpSupport.info': {
    fr: '💡 Notre équipe de support est disponible du lundi au vendredi de 9h à 18h (GMT). Nous répondons généralement dans les 24 heures.',
    en: '💡 Our support team is available Monday to Friday from 9am to 6pm (GMT). We typically respond within 24 hours.',
  },
  'contact.title': {
    fr: 'Contactez-nous',
    en: 'Contact us',
  },
  'contact.subtitle': {
    fr: 'Nous sommes là pour vous aider. N\'hésitez pas à nous contacter.',
    en: 'We are here to help. Feel free to contact us.',
  },
  'contact.sendMessage': {
    fr: 'Envoyez-nous un message',
    en: 'Send us a message',
  },
  'contact.fullName': {
    fr: 'Nom complet',
    en: 'Full name',
  },
  'contact.namePlaceholder': {
    fr: 'Votre nom',
    en: 'Your name',
  },
  'contact.emailPlaceholder': {
    fr: 'votre@email.com',
    en: 'your@email.com',
  },
  'contact.subject': {
    fr: 'Sujet',
    en: 'Subject',
  },
  'contact.subjectPlaceholder': {
    fr: 'Sujet de votre message',
    en: 'Subject of your message',
  },
  'contact.message': {
    fr: 'Message',
    en: 'Message',
  },
  'contact.messagePlaceholder': {
    fr: 'Décrivez votre demande...',
    en: 'Describe your request...',
  },
  'contact.send': {
    fr: 'Envoyer le message',
    en: 'Send message',
  },
  'contact.openingHours': {
    fr: 'Heures d\'ouverture',
    en: 'Opening hours',
  },
  'contact.mondayFriday': {
    fr: 'Lundi - Vendredi : 9h00 - 18h00',
    en: 'Monday - Friday: 9:00 AM - 6:00 PM',
  },
  'contact.saturday': {
    fr: 'Samedi : 10h00 - 16h00',
    en: 'Saturday: 10:00 AM - 4:00 PM',
  },
  'contact.sunday': {
    fr: 'Dimanche : Fermé',
    en: 'Sunday: Closed',
  },
  'gpTravels.title': {
    fr: 'Mes Voyages',
    en: 'My Trips',
  },
  'gpTravels.manageTrips': {
    fr: 'Gérer mes voyages',
    en: 'Manage my trips',
  },
  'gpTravels.subtitle': {
    fr: 'Ajoutez et mettez à jour vos destinations de voyage',
    en: 'Add and update your travel destinations',
  },
  'gpTravels.addTrip': {
    fr: 'Ajouter un voyage',
    en: 'Add trip',
  },
  'gpTravels.noTrips': {
    fr: 'Aucun voyage',
    en: 'No trips',
  },
  'gpTravels.noTripsText': {
    fr: 'Commencez par ajouter votre première annonce de voyage',
    en: 'Start by adding your first trip announcement',
  },
  'gpTravels.departure': {
    fr: 'Départ',
    en: 'Departure',
  },
  'gpTravels.max': {
    fr: 'Max',
    en: 'Max',
  },
  'gpTravels.space': {
    fr: 'Espace',
    en: 'Space',
  },
  'gpTravels.updated': {
    fr: 'Mis à jour',
    en: 'Updated',
  },
  'gpTravels.newTrip': {
    fr: 'Nouveau voyage',
    en: 'New trip',
  },
  'gpTravels.editTrip': {
    fr: 'Modifier le voyage',
    en: 'Edit trip',
  },
  'gpTravels.departureCountry': {
    fr: 'Pays de départ',
    en: 'Departure country',
  },
  'gpTravels.destinationCountry': {
    fr: 'Pays de destination',
    en: 'Destination country',
  },
  'gpTravels.departureDate': {
    fr: 'Date de départ',
    en: 'Departure date',
  },
  'gpTravels.maxWeight': {
    fr: 'Poids maximum (kg)',
    en: 'Maximum weight (kg)',
  },
  'gpTravels.pricePerKg': {
    fr: 'Prix par kg (F CFA)',
    en: 'Price per kg (F CFA)',
  },
  'gpTravels.availableSpace': {
    fr: 'Espace disponible',
    en: 'Available space',
  },
  'gpTravels.exampleMali': {
    fr: 'Ex: Mali',
    en: 'Ex: Mali',
  },
  'gpTravels.exampleDubai': {
    fr: 'Ex: Dubaï',
    en: 'Ex: Dubai',
  },
  'gpTravels.exampleDate': {
    fr: 'Ex: 15 Janvier 2025',
    en: 'Ex: January 15, 2025',
  },
  'gpTravels.exampleWeight': {
    fr: 'Ex: 23',
    en: 'Ex: 23',
  },
  'gpTravels.examplePrice': {
    fr: 'Ex: 5000',
    en: 'Ex: 5000',
  },
  'gpTravels.exampleSpace': {
    fr: 'Ex: 2 valises',
    en: 'Ex: 2 suitcases',
  },
  'gpTravels.update': {
    fr: 'Mettre à jour',
    en: 'Update',
  },
  'gpTravels.add': {
    fr: 'Ajouter',
    en: 'Add',
  },
  'gpTravels.subscriptionRequired': {
    fr: 'Abonnement requis',
    en: 'Subscription required',
  },
  'gpTravels.subscriptionRequiredText': {
    fr: 'Vous devez être abonné en tant que GP pour gérer vos annonces de voyage.',
    en: 'You must be subscribed as a GP to manage your travel announcements.',
  },
  'gpTravels.backToProfile': {
    fr: 'Retour au profil',
    en: 'Back to profile',
  },
};

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
