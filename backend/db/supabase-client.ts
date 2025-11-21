import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase-types';

// Configuration Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] URL ou clé anonyme manquante. Vérifiez vos variables d\'environnement.'
  );
}

// Créer le client Supabase avec les types TypeScript
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Désactiver l'auto-refresh pour un contrôle manuel
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// Helper pour définir le contexte utilisateur (pour RLS)
export const setUserContext = async (userId: string) => {
  const { error } = await supabase.rpc('set_config', {
    setting: 'app.user_id',
    value: userId,
  } as any);
  
  if (error) {
    console.error('[Supabase] Erreur lors de la définition du contexte utilisateur:', error);
  }
};

// Helper pour obtenir les statistiques actuelles
export const getCurrentStatistics = async () => {
  const { data, error } = await supabase
    .from('app_statistics')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    console.error('[Supabase] Erreur lors de la récupération des statistiques:', error);
    return null;
  }
  
  return data;
};

// Helper pour mettre à jour les statistiques
export const updateStatistics = async () => {
  const { error } = await supabase.rpc('update_app_statistics');
  
  if (error) {
    console.error('[Supabase] Erreur lors de la mise à jour des statistiques:', error);
    return false;
  }
  
  return true;
};

// Helper pour obtenir un profil utilisateur complet (avec abonnement GP)
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('[Supabase] Erreur lors de la récupération du profil:', error);
    return null;
  }
  
  return data;
};

// Helper pour obtenir les détails complets d'un envoi
export const getShipmentDetails = async (shipmentId: string) => {
  const { data, error } = await supabase
    .from('shipment_details')
    .select('*')
    .eq('id', shipmentId)
    .single();
  
  if (error) {
    console.error('[Supabase] Erreur lors de la récupération des détails de l\'envoi:', error);
    return null;
  }
  
  return data;
};

// Helper pour obtenir l'historique de suivi d'un envoi
export const getTrackingHistory = async (shipmentId: string) => {
  const { data, error } = await supabase
    .from('tracking_history')
    .select('*')
    .eq('shipment_id', shipmentId)
    .order('timestamp', { ascending: true });
  
  if (error) {
    console.error('[Supabase] Erreur lors de la récupération de l\'historique:', error);
    return [];
  }
  
  return data;
};

// Helper pour obtenir les conversations d'un utilisateur avec les participants
export const getUserConversations = async (userId: string) => {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      *,
      conversation_participants (
        user_id,
        user_name,
        is_gp
      )
    `)
    .order('last_message_time', { ascending: false });
  
  if (error) {
    console.error('[Supabase] Erreur lors de la récupération des conversations:', error);
    return [];
  }
  
  // Filtrer les conversations où l'utilisateur est participant
  return conversations.filter(conv => 
    conv.conversation_participants?.some((p: any) => p.user_id === userId)
  );
};

export default supabase;
