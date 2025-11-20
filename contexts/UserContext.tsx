import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trpc } from '@/lib/trpc';

export interface TravelAnnouncement {
  id: string;
  fromCountry: string;
  toCountry: string;
  departureDate: string;
  maxWeight: string;
  pricePerKg: string;
  availableSpace: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  contact: string;
  isVerified: boolean;
  createdAt: string;
  isGP: boolean;
  gpSubscription?: {
    isActive: boolean;
    startDate: string;
    endDate: string;
    amount: number;
  };
  gpTravelAnnouncements?: TravelAnnouncement[];
}

export interface CreateProfileInput {
  firstName: string;
  lastName: string;
  country: string;
  contact: string;
  password: string;
  isGP?: boolean;
  gpSubscription?: {
    isActive: boolean;
    startDate: string;
    endDate: string;
    amount: number;
  };
}

const USER_STORAGE_KEY = '@gp_connect_user_profile';

export const [UserProvider, useUser] = createContextHook(() => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserProfile = useCallback(async () => {
    console.log('[UserContext] Loading user profile...');
    try {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        try {
          const profile = JSON.parse(stored);
          console.log('[UserContext] Profile loaded:', profile);
          setUserProfile(profile);
        } catch (parseError) {
          console.error('[UserContext] Error parsing stored profile, clearing corrupted data:', parseError);
          await AsyncStorage.removeItem(USER_STORAGE_KEY);
          setUserProfile(null);
        }
      } else {
        console.log('[UserContext] No profile found in storage');
      }
    } catch (error) {
      console.error('[UserContext] Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const createProfileMutation = trpc.users.createProfile.useMutation();
  const updateProfileMutation = trpc.users.updateProfile.useMutation();
  const subscribeGpMutation = trpc.users.subscribeGp.useMutation();

  const saveUserProfile = useCallback(async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      setUserProfile(profile);
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }, []);

  const createProfile = useCallback(async (data: CreateProfileInput) => {
    try {
      const newProfile = await createProfileMutation.mutateAsync(data);
      await saveUserProfile(newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }, [createProfileMutation, saveUserProfile]);

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    try {
      const updated = await updateProfileMutation.mutateAsync({
        userId: userProfile.id,
        updates,
      });
      await saveUserProfile(updated);
      console.log('[UserContext] Profile updated successfully via backend');
      return updated;
    } catch (error) {
      console.log('[UserContext] Backend update failed, updating locally:', error);
      const updated = { ...userProfile, ...updates };
      await saveUserProfile(updated);
      return updated;
    }
  }, [userProfile, updateProfileMutation, saveUserProfile]);

  const subscribeAsGp = useCallback(async () => {
    if (!userProfile) throw new Error('Aucun profil utilisateur');
    
    try {
      const updated = await subscribeGpMutation.mutateAsync({ userId: userProfile.id });
      if (updated) {
        await saveUserProfile(updated);
      }
      return updated;
    } catch (error) {
      console.error('Error subscribing as GP:', error);
      throw error;
    }
  }, [userProfile, subscribeGpMutation, saveUserProfile]);

  const clearUserProfile = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUserProfile(null);
    } catch (error) {
      console.error('Error clearing user profile:', error);
    }
  }, []);

  const hasProfile = !!userProfile;

  const addTravelAnnouncement = useCallback(async (announcement: Omit<TravelAnnouncement, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userProfile) return;
    
    const newAnnouncement: TravelAnnouncement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updated = {
      ...userProfile,
      gpTravelAnnouncements: [...(userProfile.gpTravelAnnouncements || []), newAnnouncement],
    };
    
    await saveUserProfile(updated);
  }, [userProfile, saveUserProfile]);

  const updateTravelAnnouncement = useCallback(async (id: string, updates: Partial<Omit<TravelAnnouncement, 'id' | 'createdAt'>>) => {
    if (!userProfile || !userProfile.gpTravelAnnouncements) return;
    
    const updated = {
      ...userProfile,
      gpTravelAnnouncements: userProfile.gpTravelAnnouncements.map(announcement =>
        announcement.id === id
          ? { ...announcement, ...updates, updatedAt: new Date().toISOString() }
          : announcement
      ),
    };
    
    await saveUserProfile(updated);
  }, [userProfile, saveUserProfile]);

  const deleteTravelAnnouncement = useCallback(async (id: string) => {
    if (!userProfile || !userProfile.gpTravelAnnouncements) return;
    
    const updated = {
      ...userProfile,
      gpTravelAnnouncements: userProfile.gpTravelAnnouncements.filter(announcement => announcement.id !== id),
    };
    
    await saveUserProfile(updated);
  }, [userProfile, saveUserProfile]);

  return useMemo(() => ({
    userProfile,
    isLoading,
    hasProfile,
    createProfile,
    saveUserProfile,
    updateUserProfile,
    clearUserProfile,
    subscribeAsGp,
    addTravelAnnouncement,
    updateTravelAnnouncement,
    deleteTravelAnnouncement,
  }), [userProfile, isLoading, hasProfile, createProfile, saveUserProfile, updateUserProfile, clearUserProfile, subscribeAsGp, addTravelAnnouncement, updateTravelAnnouncement, deleteTravelAnnouncement]);
});
