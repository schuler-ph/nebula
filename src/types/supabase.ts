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
          currentWeight: number | null
          day: string
          id: string
          last_modified: string | null
          title: string | null
          todoDailyDone: string[]
          user_id: string
          week_closure: string | null
        }
        Insert: {
          content?: string | null
          content_projects?: string | null
          content_training?: string | null
          content_uni?: string | null
          currentWeight?: number | null
          day: string
          id?: string
          last_modified?: string | null
          title?: string | null
          todoDailyDone?: string[]
          user_id: string
          week_closure?: string | null
        }
        Update: {
          content?: string | null
          content_projects?: string | null
          content_training?: string | null
          content_uni?: string | null
          currentWeight?: number | null
          day?: string
          id?: string
          last_modified?: string | null
          title?: string | null
          todoDailyDone?: string[]
          user_id?: string
          week_closure?: string | null
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
          user_id: string | null
        }
        Insert: {
          id?: number
          name: string
          user_id?: string | null
        }
        Update: {
          id?: number
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exerciseCategory_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
      todo: {
        Row: {
          category: string
          id: string
          name: string
          subtodo_of: string | null
          user_id: string
        }
        Insert: {
          category: string
          id?: string
          name: string
          subtodo_of?: string | null
          user_id: string
        }
        Update: {
          category?: string
          id?: string
          name?: string
          subtodo_of?: string | null
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
