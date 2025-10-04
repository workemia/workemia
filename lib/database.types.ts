export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          user_type: "client" | "provider" | "admin"
          name: string
          phone: string | null
          avatar_url: string | null
          location: string | null
          birth_date: string | null
          cpf: string | null
          verified: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          user_type?: "client" | "provider" | "admin"
          name: string
          phone?: string | null
          avatar_url?: string | null
          location?: string | null
          birth_date?: string | null
          cpf?: string | null
          verified?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          user_type?: "client" | "provider" | "admin"
          name?: string
          phone?: string | null
          avatar_url?: string | null
          location?: string | null
          birth_date?: string | null
          cpf?: string | null
          verified?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      providers: {
        Row: {
          id: string
          bio: string | null
          profession: string | null
          experience: string | null
          hourly_rate: number | null
          work_radius: number
          rating: number
          total_reviews: number
          completed_jobs: number
          response_time: string
          acceptance_rate: number
          joined_year: number
          specialties: string[] | null
          availability: Json
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          bio?: string | null
          profession?: string | null
          experience?: string | null
          hourly_rate?: number | null
          work_radius?: number
          rating?: number
          total_reviews?: number
          completed_jobs?: number
          response_time?: string
          acceptance_rate?: number
          joined_year?: number
          specialties?: string[] | null
          availability?: Json
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bio?: string | null
          profession?: string | null
          experience?: string | null
          hourly_rate?: number | null
          work_radius?: number
          rating?: number
          total_reviews?: number
          completed_jobs?: number
          response_time?: string
          acceptance_rate?: number
          joined_year?: number
          specialties?: string[] | null
          availability?: Json
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          active?: boolean
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          description: string
          category_id: string | null
          client_id: string
          provider_id: string | null
          status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
          urgency: "low" | "normal" | "high" | "urgent"
          budget_min: number | null
          budget_max: number | null
          final_price: number | null
          location: string | null
          latitude: number | null
          longitude: number | null
          preferred_date: string | null
          start_date: string | null
          end_date: string | null
          estimated_duration: number | null
          progress: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category_id?: string | null
          client_id: string
          provider_id?: string | null
          status?: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
          urgency?: "low" | "normal" | "high" | "urgent"
          budget_min?: number | null
          budget_max?: number | null
          final_price?: number | null
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          preferred_date?: string | null
          start_date?: string | null
          end_date?: string | null
          estimated_duration?: number | null
          progress?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category_id?: string | null
          client_id?: string
          provider_id?: string | null
          status?: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
          urgency?: "low" | "normal" | "high" | "urgent"
          budget_min?: number | null
          budget_max?: number | null
          final_price?: number | null
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          preferred_date?: string | null
          start_date?: string | null
          end_date?: string | null
          estimated_duration?: number | null
          progress?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: "service_request" | "message" | "payment" | "review" | "system" | "reminder"
          title: string
          message: string
          data: Json
          read: boolean
          urgent: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "service_request" | "message" | "payment" | "review" | "system" | "reminder"
          title: string
          message: string
          data?: Json
          read?: boolean
          urgent?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: "service_request" | "message" | "payment" | "review" | "system" | "reminder"
          title?: string
          message?: string
          data?: Json
          read?: boolean
          urgent?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          provider_id: string
          service_id: string | null
          title: string
          start_time: string
          end_time: string | null
          background_color: string
          border_color: string
          text_color: string
          created_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          service_id?: string | null
          title: string
          start_time: string
          end_time?: string | null
          background_color?: string
          border_color?: string
          text_color?: string
          created_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          service_id?: string | null
          title?: string
          start_time?: string
          end_time?: string | null
          background_color?: string
          border_color?: string
          text_color?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: "client" | "provider" | "admin"
      service_status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
      request_status: "new" | "proposal_sent" | "accepted" | "rejected"
      urgency_level: "low" | "normal" | "high" | "urgent"
      notification_type: "service_request" | "message" | "payment" | "review" | "system" | "reminder"
      payment_status: "pending" | "completed" | "failed" | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
