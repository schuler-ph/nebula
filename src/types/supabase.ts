export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      diary: {
        Row: {
          content: string | null
          currentWeight: number | null
          day: string
          id: string
          last_modified: string | null
          title: string | null
          todoDailyDone: string[]
          user_id: string
        }
        Insert: {
          content?: string | null
          currentWeight?: number | null
          day: string
          id?: string
          last_modified?: string | null
          title?: string | null
          todoDailyDone?: string[]
          user_id: string
        }
        Update: {
          content?: string | null
          currentWeight?: number | null
          day?: string
          id?: string
          last_modified?: string | null
          title?: string | null
          todoDailyDone?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      exercise: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          subCategory: string | null
          subSkillCategory: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          name: string
          subCategory?: string | null
          subSkillCategory?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          subCategory?: string | null
          subSkillCategory?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ingredient: {
        Row: {
          carbs: number | null
          created_at: string
          fats: number | null
          id: string
          kcal: number | null
          name: string | null
          protein: number | null
          salt: number | null
          sat_fats: number | null
          sugar: number | null
          updated_at: string | null
          usual_weight: number | null
        }
        Insert: {
          carbs?: number | null
          created_at?: string
          fats?: number | null
          id?: string
          kcal?: number | null
          name?: string | null
          protein?: number | null
          salt?: number | null
          sat_fats?: number | null
          sugar?: number | null
          updated_at?: string | null
          usual_weight?: number | null
        }
        Update: {
          carbs?: number | null
          created_at?: string
          fats?: number | null
          id?: string
          kcal?: number | null
          name?: string | null
          protein?: number | null
          salt?: number | null
          sat_fats?: number | null
          sugar?: number | null
          updated_at?: string | null
          usual_weight?: number | null
        }
        Relationships: []
      }
      split: {
        Row: {
          categories: string[]
          exercises: string[]
          id: string
          index: number | null
          last_modified: string
          name: string
          user_id: string
          weekdaySelection: number[]
        }
        Insert: {
          categories?: string[]
          exercises: string[]
          id?: string
          index?: number | null
          last_modified?: string
          name?: string
          user_id: string
          weekdaySelection?: number[]
        }
        Update: {
          categories?: string[]
          exercises?: string[]
          id?: string
          index?: number | null
          last_modified?: string
          name?: string
          user_id?: string
          weekdaySelection?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "split_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      todo: {
        Row: {
          category: string
          created_at: string
          done: boolean
          id: string
          inactive: boolean
          name: string
          order: number | null
          subtodo_of: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          done?: boolean
          id?: string
          inactive?: boolean
          name: string
          order?: number | null
          subtodo_of?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          done?: boolean
          id?: string
          inactive?: boolean
          name?: string
          order?: number | null
          subtodo_of?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_subtodo_of_fkey"
            columns: ["subtodo_of"]
            referencedRelation: "todo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
