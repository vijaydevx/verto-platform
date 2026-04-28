export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      campuses: {
        Row: {
          id: string;
          name: string;
          domain: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          campus_email: string;
          campus_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          campus_email: string;
          campus_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          campus_email?: string;
          campus_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_campus_id_fkey";
            columns: ["campus_id"];
            referencedRelation: "campuses";
            referencedColumns: ["id"];
          },
        ];
      };
      items: {
        Row: {
          id: string;
          title: string;
          description: string;
          location: string;
          reported_date: string;
          type: "lost" | "found";
          image_url: string;
          user_id: string;
          campus_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          location: string;
          reported_date: string;
          type: "lost" | "found";
          image_url: string;
          user_id: string;
          campus_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          location?: string;
          reported_date?: string;
          type?: "lost" | "found";
          image_url?: string;
          user_id?: string;
          campus_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "items_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "items_campus_id_fkey";
            columns: ["campus_id"];
            referencedRelation: "campuses";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type CampusRow = Database["public"]["Tables"]["campuses"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type ItemRow = Database["public"]["Tables"]["items"]["Row"];
export type ItemInsert = Database["public"]["Tables"]["items"]["Insert"];
export type ItemUpdate = Database["public"]["Tables"]["items"]["Update"];

export interface ItemWithProfile extends ItemRow {
  profiles: Pick<ProfileRow, "id" | "full_name" | "campus_email"> | null;
}

export interface UploadSignResponse {
  uploadUrl: string;
  publicUrl: string;
  objectKey: string;
  expiresIn: number;
}

export interface PaginatedItemsResult {
  items: ItemWithProfile[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

