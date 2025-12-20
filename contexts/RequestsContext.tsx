import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Request {
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

const REQUESTS_STORAGE_KEY = '@gp_connect_requests';

export const [RequestsProvider, useRequests] = createContextHook(() => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadRequests = useCallback(async () => {
    console.log('[RequestsContext] Loading requests...');
    setIsLoading(true);
    try {
      const stored = await AsyncStorage.getItem(REQUESTS_STORAGE_KEY);
      if (stored) {
        const parsedRequests = JSON.parse(stored);
        console.log('[RequestsContext] Requests loaded:', parsedRequests);
        setRequests(parsedRequests);
      }
    } catch (error) {
      console.error('[RequestsContext] Error loading requests:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const saveRequests = useCallback(async (newRequests: Request[]) => {
    try {
      await AsyncStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(newRequests));
      setRequests(newRequests);
      console.log('[RequestsContext] Requests saved successfully');
    } catch (error) {
      console.error('[RequestsContext] Error saving requests:', error);
      throw error;
    }
  }, []);

  const addRequest = useCallback(async (request: Omit<Request, 'id' | 'postedDate'>) => {
    const newRequest: Request = {
      ...request,
      id: Date.now().toString(),
      postedDate: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
    };
    const updated = [...requests, newRequest];
    await saveRequests(updated);
    return newRequest;
  }, [requests, saveRequests]);

  const deleteRequest = useCallback(async (requestId: string) => {
    const updated = requests.filter(request => request.id !== requestId);
    await saveRequests(updated);
  }, [requests, saveRequests]);

  const clearAllRequests = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(REQUESTS_STORAGE_KEY);
      setRequests([]);
      console.log('[RequestsContext] All requests cleared');
    } catch (error) {
      console.error('[RequestsContext] Error clearing requests:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    requests,
    isLoading,
    addRequest,
    deleteRequest,
    clearAllRequests,
    refetch: loadRequests,
  }), [requests, isLoading, addRequest, deleteRequest, clearAllRequests, loadRequests]);
});
