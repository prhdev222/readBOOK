import { createClient } from '@supabase/supabase-js';

// ตั้งค่า Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          description: string | null;
          cover_image: string | null;
          category: string;
          tags: string[];
          published_date: string | null;
          isbn: string | null;
          language: string;
          pages: number | null;
          file_size: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author: string;
          description?: string | null;
          cover_image?: string | null;
          category: string;
          tags?: string[];
          published_date?: string | null;
          isbn?: string | null;
          language?: string;
          pages?: number | null;
          file_size?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string;
          description?: string | null;
          cover_image?: string | null;
          category?: string;
          tags?: string[];
          published_date?: string | null;
          isbn?: string | null;
          language?: string;
          pages?: number | null;
          file_size?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      book_links: {
        Row: {
          id: string;
          book_id: string;
          type: 'google_drive' | 'dropbox' | 'onedrive' | 'mega' | 'mediafire' | 'direct' | 'other';
          url: string;
          title: string;
          description: string | null;
          is_primary: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          type: 'google_drive' | 'dropbox' | 'onedrive' | 'mega' | 'mediafire' | 'direct' | 'other';
          url: string;
          title: string;
          description?: string | null;
          is_primary?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string;
          type?: 'google_drive' | 'dropbox' | 'onedrive' | 'mega' | 'mediafire' | 'direct' | 'other';
          url?: string;
          title?: string;
          description?: string | null;
          is_primary?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string;
          icon: string;
          book_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          color: string;
          icon: string;
          book_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          icon?: string;
          book_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
