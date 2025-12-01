import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelAnnouncement, UserProfile } from './UserContext';

const TRAVELS_STORAGE_KEY = '@gp_connect_travels';
const USER_STORAGE_KEY = '@gp_connect_user_profile';

export const [TravelsProvider, useTravels] = createContextHook(() => {
  const [travels, setTravels] = useState<TravelAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTravels = useCallback(async () => {
    console.log('[TravelsContext] Loading travels...');
    setIsLoading(true);
    try {
      const stored = await AsyncStorage.getItem(TRAVELS_STORAGE_KEY);
      const userStored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      
      let allTravels: TravelAnnouncement[] = [];
      
      if (stored) {
        allTravels = JSON.parse(stored);
      }
      
      if (userStored) {
        try {
          const userProfile: UserProfile = JSON.parse(userStored);
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

  return useMemo(() => ({
    travels,
    isLoading,
    addTravel,
    updateTravel,
    deleteTravel,
    getGpTravels,
    refetch: loadTravels,
  }), [travels, isLoading, addTravel, updateTravel, deleteTravel, getGpTravels, loadTravels]);
});
