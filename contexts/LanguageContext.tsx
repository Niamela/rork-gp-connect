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
