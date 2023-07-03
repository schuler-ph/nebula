export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      diary: {
        Row: {
          content: string | null;
          day: string;
          id: string;
          last_modified: string | null;
          title: string | null;
          user_id: string;
        };
        Insert: {
          content?: string | null;
          day: string;
          id?: string;
          last_modified?: string | null;
          title?: string | null;
          user_id: string;
        };
        Update: {
          content?: string | null;
          day?: string;
          id?: string;
          last_modified?: string | null;
          title?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "diary_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
