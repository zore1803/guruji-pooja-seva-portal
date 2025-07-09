export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_credentials: {
        Row: {
          created_at: string | null
          email: string
          id: number
          password_hash: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          password_hash: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          password_hash?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          address: string | null
          admin_notes: string | null
          assigned_at: string | null
          completed_at: string | null
          confirmed_date: string | null
          created_at: string
          created_by: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          invoice_url: string | null
          location: string | null
          pandit_id: string | null
          service_id: number | null
          status: string | null
          tentative_date: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          assigned_at?: string | null
          completed_at?: string | null
          confirmed_date?: string | null
          created_at?: string
          created_by?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          invoice_url?: string | null
          location?: string | null
          pandit_id?: string | null
          service_id?: number | null
          status?: string | null
          tentative_date?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          assigned_at?: string | null
          completed_at?: string | null
          confirmed_date?: string | null
          created_at?: string
          created_by?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          invoice_url?: string | null
          location?: string | null
          pandit_id?: string | null
          service_id?: number | null
          status?: string | null
          tentative_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string
          id: string
          is_verified: boolean | null
          name: string
          phone: string | null
          profile_image_url: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email: string
          id: string
          is_verified?: boolean | null
          name: string
          phone?: string | null
          profile_image_url?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          is_verified?: boolean | null
          name?: string
          phone?: string | null
          profile_image_url?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string | null
          email: string
          id: number
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          message?: string
          name?: string
        }
        Relationships: []
      }
      pandit_profiles: {
        Row: {
          aadhar_number: string | null
          address: string | null
          created_at: string
          email: string
          expertise: string | null
          id: string
          is_verified: boolean | null
          name: string
          phone: string | null
          profile_image_url: string | null
          state: string | null
          updated_at: string
          work_locations: string[] | null
        }
        Insert: {
          aadhar_number?: string | null
          address?: string | null
          created_at?: string
          email: string
          expertise?: string | null
          id: string
          is_verified?: boolean | null
          name: string
          phone?: string | null
          profile_image_url?: string | null
          state?: string | null
          updated_at?: string
          work_locations?: string[] | null
        }
        Update: {
          aadhar_number?: string | null
          address?: string | null
          created_at?: string
          email?: string
          expertise?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          phone?: string | null
          profile_image_url?: string | null
          state?: string | null
          updated_at?: string
          work_locations?: string[] | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number | null
          booking_id: string | null
          created_at: string
          customer_id: string | null
          id: string
          method: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount?: number | null
          booking_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          method?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number | null
          booking_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          method?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aadhar_number: string | null
          address: string | null
          created_at: string
          email: string
          expertise: string | null
          id: string
          is_verified: boolean | null
          name: string
          profile_image_url: string | null
          user_type: Database["public"]["Enums"]["user_type"]
          work_locations: string[] | null
        }
        Insert: {
          aadhar_number?: string | null
          address?: string | null
          created_at?: string
          email: string
          expertise?: string | null
          id: string
          is_verified?: boolean | null
          name: string
          profile_image_url?: string | null
          user_type: Database["public"]["Enums"]["user_type"]
          work_locations?: string[] | null
        }
        Update: {
          aadhar_number?: string | null
          address?: string | null
          created_at?: string
          email?: string
          expertise?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          profile_image_url?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
          work_locations?: string[] | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          id: number
          image: string | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          image?: string | null
          name: string
          price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          image?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          email: string
          id: number
          subscribed_at: string | null
        }
        Insert: {
          email: string
          id?: number
          subscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: number
          subscribed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user_safe: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
    }
    Enums: {
      user_type: "pandit" | "customer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_type: ["pandit", "customer", "admin"],
    },
  },
} as const
