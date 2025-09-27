export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      BucketInstances: {
        Row: {
          bucket_metadata_id: string | null
          created_at: string
          end: string | null
          id: string
          start: string | null
        }
        Insert: {
          bucket_metadata_id?: string | null
          created_at?: string
          end?: string | null
          id?: string
          start?: string | null
        }
        Update: {
          bucket_metadata_id?: string | null
          created_at?: string
          end?: string | null
          id?: string
          start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "BucketInstances_bucket_metadata_id_fkey"
            columns: ["bucket_metadata_id"]
            isOneToOne: false
            referencedRelation: "BucketMetadata"
            referencedColumns: ["id"]
          },
        ]
      }
      BucketMetadata: {
        Row: {
          created_at: string
          id: string
          name: string | null
          recurrence_period_type: number | null
          spending_limit: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          recurrence_period_type?: number | null
          spending_limit?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          recurrence_period_type?: number | null
          spending_limit?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "BucketMetadata_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      ChallengeMemberships: {
        Row: {
          challenge_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ChallengeMemberships_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "Challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ChallengeMemberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Challenges: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          end: string | null
          id: string
          name: string
          owner: string | null
          start: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          end?: string | null
          id?: string
          name: string
          owner?: string | null
          start: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          end?: string | null
          id?: string
          name?: string
          owner?: string | null
          start?: string
        }
        Relationships: [
          {
            foreignKeyName: "Challenges_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Expenses: {
        Row: {
          amount: number
          bucket_instance_id: string | null
          challenge_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          settle_split_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          bucket_instance_id?: string | null
          challenge_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          settle_split_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          bucket_instance_id?: string | null
          challenge_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          settle_split_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Expenses_bucket_instance_id_fkey"
            columns: ["bucket_instance_id"]
            isOneToOne: false
            referencedRelation: "BucketInstances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Expenses_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "Challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Expenses_settle_split_id_fkey"
            columns: ["settle_split_id"]
            isOneToOne: false
            referencedRelation: "Splits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      GroupMemberships: {
        Row: {
          created_at: string
          group_id: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "GroupMembership_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "Groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "GroupMembership_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Groups: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      Splits: {
        Row: {
          amount_owed: number | null
          amount_remaining: number | null
          created_at: string
          group_id: string | null
          id: string
          original_expense_id: string | null
          user_id: string | null
        }
        Insert: {
          amount_owed?: number | null
          amount_remaining?: number | null
          created_at?: string
          group_id?: string | null
          id?: string
          original_expense_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount_owed?: number | null
          amount_remaining?: number | null
          created_at?: string
          group_id?: string | null
          id?: string
          original_expense_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ExpenseSplits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Splits_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "Groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Splits_original_expense_id_fkey"
            columns: ["original_expense_id"]
            isOneToOne: false
            referencedRelation: "Expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
