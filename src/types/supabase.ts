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
          content_projects: string | null
          content_training: string | null
          content_uni: string | null
          day: string
          id: string
          last_modified: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          content_projects?: string | null
          content_training?: string | null
          content_uni?: string | null
          day: string
          id?: string
          last_modified?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          content_projects?: string | null
          content_training?: string | null
          content_uni?: string | null
          day?: string
          id?: string
          last_modified?: string | null
          title?: string | null
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
          category: number | null
          id: string
          last_modified: string
          name: string
          user_id: string
        }
        Insert: {
          category?: number | null
          id?: string
          last_modified?: string
          name: string
          user_id: string
        }
        Update: {
          category?: number | null
          id?: string
          last_modified?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_category_fkey"
            columns: ["category"]
            referencedRelation: "exerciseCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      exerciseCategory: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      split: {
        Row: {
          exercises: string[] | null
          id: string
          index: number | null
          last_modified: string
          name: string
          user_id: string
        }
        Insert: {
          exercises?: string[] | null
          id?: string
          index?: number | null
          last_modified?: string
          name?: string
          user_id: string
        }
        Update: {
          exercises?: string[] | null
          id?: string
          index?: number | null
          last_modified?: string
          name?: string
          user_id?: string
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
