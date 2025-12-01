import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelAnnouncement, UserProfile } from './UserContext';

export interface TravelWithGPInfo extends TravelAnnouncement {
  gpProfile?: {
    firstName: string;
    lastName: string;
    profileImageUri?: string;
  };
}

const TRAVELS_STORAGE_KEY = '@gp_connect_travels';
const USER_STORAGE_KEY = '@gp_connect_user_profile';
const ALL_PROFILES_STORAGE_KEY = '@gp_connect_all_profiles';

export const [TravelsProvider, useTravels] = createContextHook(() => {
  const [travels, setTravels] = useState<TravelAnnouncement[]>([]);
  const [allProfiles, setAllProfiles] = useState<Record<string, UserProfile>>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadTravels = useCallback(async () => {
    console.log('[TravelsContext] Loading travels...');
    setIsLoading(true);
    try {
      const stored = await AsyncStorage.getItem(TRAVELS_STORAGE_KEY);
      const userStored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      const profilesStored = await AsyncStorage.getItem(ALL_PROFILES_STORAGE_KEY);
      
      let allTravels: TravelAnnouncement[] = [];
      let profiles: Record<string, UserProfile> = {};
      
      if (profilesStored) {
        profiles = JSON.parse(profilesStored);
      }
      
      if (stored) {
        allTravels = JSON.parse(stored);
      }
      
      if (userStored) {
        try {
          const userProfile: UserProfile = JSON.parse(userStored);
          
          profiles[userProfile.id] = userProfile;
          
          if (userProfile.gpTravelAnnouncements && userProfile.gpTravelAnnouncements.length > 0) {
            const userTravels = userProfile.gpTravelAnnouncements;
            const existingIds = new Set(allTravels.map(t => t.id));
            const newTravels = userTravels.filter(t => !existingIds.has(t.id));
            allTravels = [...allTravels, ...newTravels];
            
            if (newTravels.length > 0) {
              await AsyncStorage.setItem(TRAVELS_STORAGE_KEY, JSON.stringify(allTravels));
              console.log('[TravelsContext] Synced user travels to global travels');
            }
          }
        } catch (parseError) {
          console.error('[TravelsContext] Error parsing user profile:', parseError);
        }
      }
      
      await AsyncStorage.setItem(ALL_PROFILES_STORAGE_KEY, JSON.stringify(profiles));
      setAllProfiles(profiles);
      
      console.log('[TravelsContext] Travels loaded:', allTravels);
      setTravels(allTravels);
    } catch (error) {
      console.error('[TravelsContext] Error loading travels:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTravels();
  }, [loadTravels]);

  const saveTravels = useCallback(async (newTravels: TravelAnnouncement[]) => {
    try {
      await AsyncStorage.setItem(TRAVELS_STORAGE_KEY, JSON.stringify(newTravels));
      setTravels(newTravels);
      console.log('[TravelsContext] Travels saved successfully');
    } catch (error) {
      console.error('[TravelsContext] Error saving travels:', error);
      throw error;
    }
  }, []);

  const addTravel = useCallback(async (travel: Omit<TravelAnnouncement, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const newTravel: TravelAnnouncement = {
      ...travel,
      id: travel.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...travels, newTravel];
    await saveTravels(updated);
    return newTravel;
  }, [travels, saveTravels]);

  const updateTravel = useCallback(async (id: string, updates: Partial<Omit<TravelAnnouncement, 'id' | 'createdAt'>>) => {
    const updated = travels.map(travel =>
      travel.id === id
        ? { ...travel, ...updates, updatedAt: new Date().toISOString() }
        : travel
    );
    await saveTravels(updated);
  }, [travels, saveTravels]);

  const deleteTravel = useCallback(async (id: string) => {
    const updated = travels.filter(travel => travel.id !== id);
    await saveTravels(updated);
  }, [travels, saveTravels]);

  const getGpTravels = useCallback((gpId: string) => {
    return travels.filter(travel => travel.gpId === gpId);
  }, [travels]);

  const getTravelsWithGPInfo = useCallback((): TravelWithGPInfo[] => {
    return travels.map(travel => {
      const gpProfile = allProfiles[travel.gpId];
      if (gpProfile) {
        return {
          ...travel,
          gpProfile: {
            firstName: gpProfile.firstName,
            lastName: gpProfile.lastName,
            profileImageUri: gpProfile.profileImageUri,
          },
        };
      }
      return travel;
    });
  }, [travels, allProfiles]);

  return useMemo(() => ({
    travels,
    isLoading,
    addTravel,
    updateTravel,
    deleteTravel,
    getGpTravels,
    getTravelsWithGPInfo,
    refetch: loadTravels,
  }), [travels, isLoading, addTravel, updateTravel, deleteTravel, getGpTravels, getTravelsWithGPInfo, loadTravels]);
});
