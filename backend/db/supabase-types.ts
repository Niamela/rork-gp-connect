// Types pour Supabase Database
// Généré à partir du schéma Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ShipmentStatus =
  | 'pending'
  | 'accepted'
  | 'in_transit'
  | 'customs'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          country: string
          contact: string
          password: string
          is_verified: boolean
          is_gp: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          country: string
          contact: string
          password: string
          is_verified?: boolean
          is_gp?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          country?: string
          contact?: string
          password?: string
          is_verified?: boolean
          is_gp?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      gp_subscriptions: {
        Row: {
          id: string
          user_id: string
          is_active: boolean
          start_date: string
          end_date: string
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          is_active?: boolean
          start_date: string
          end_date: string
          amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          is_active?: boolean
          start_date?: string
          end_date?: string
          amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      travel_announcements: {
        Row: {
          id: string
          gp_id: string
          from_country: string
          to_country: string
          departure_date: string
          max_weight: string
          price_per_kg: string
          available_space: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gp_id: string
          from_country: string
          to_country: string
          departure_date: string
          max_weight: string
          price_per_kg: string
          available_space: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gp_id?: string
          from_country?: string
          to_country?: string
          departure_date?: string
          max_weight?: string
          price_per_kg?: string
          available_space?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      request_announcements: {
        Row: {
          id: string
          user_id: string
          user_name: string
          from_country: string
          to_country: string
          weight: string
          date: string
          product_type: string
          description: string | null
          contact_info: string
          posted_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_name: string
          from_country: string
          to_country: string
          weight: string
          date: string
          product_type: string
          description?: string | null
          contact_info: string
          posted_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string
          from_country?: string
          to_country?: string
          weight?: string
          date?: string
          product_type?: string
          description?: string | null
          contact_info?: string
          posted_date?: string
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          last_message: string | null
          last_message_time: string | null
          request_id: string | null
          travel_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          last_message?: string | null
          last_message_time?: string | null
          request_id?: string | null
          travel_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          last_message?: string | null
          last_message_time?: string | null
          request_id?: string | null
          travel_id?: string | null
          created_at?: string
        }
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          user_name: string
          is_gp: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          user_name: string
          is_gp?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          user_name?: string
          is_gp?: boolean
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          sender_name: string
          content: string
          read: boolean
          timestamp: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          sender_name: string
          content: string
          read?: boolean
          timestamp?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          sender_name?: string
          content?: string
          read?: boolean
          timestamp?: string
        }
      }
      shipments: {
        Row: {
          id: string
          request_id: string
          gp_id: string
          user_id: string
          status: ShipmentStatus
          tracking_number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          gp_id: string
          user_id: string
          status?: ShipmentStatus
          tracking_number: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          gp_id?: string
          user_id?: string
          status?: ShipmentStatus
          tracking_number?: string
          created_at?: string
          updated_at?: string
        }
      }
      tracking_history: {
        Row: {
          id: string
          shipment_id: string
          status: ShipmentStatus
          location: string
          notes: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          shipment_id: string
          status: ShipmentStatus
          location: string
          notes?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          shipment_id?: string
          status?: ShipmentStatus
          location?: string
          notes?: string | null
          timestamp?: string
        }
      }
      app_statistics: {
        Row: {
          id: string
          total_users: number
          total_gps: number
          total_shipments: number
          total_successful_deliveries: number
          total_revenue: number
          active_gps: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          total_users?: number
          total_gps?: number
          total_shipments?: number
          total_successful_deliveries?: number
          total_revenue?: number
          active_gps?: number
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          total_users?: number
          total_gps?: number
          total_shipments?: number
          total_successful_deliveries?: number
          total_revenue?: number
          active_gps?: number
          date?: string
          created_at?: string
        }
      }
    }
    Views: {
      user_profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          country: string
          contact: string
          password: string
          is_verified: boolean
          is_gp: boolean
          created_at: string
          updated_at: string
          gp_subscription: Json | null
        }
      }
      shipment_details: {
        Row: {
          id: string
          request_id: string
          gp_id: string
          user_id: string
          status: ShipmentStatus
          tracking_number: string
          created_at: string
          updated_at: string
          user_name: string
          user_contact: string
          gp_name: string
          gp_contact: string
          from_country: string
          to_country: string
          product_type: string
        }
      }
    }
    Functions: {
      update_app_statistics: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
    Enums: {
      shipment_status: ShipmentStatus
    }
  }
}
