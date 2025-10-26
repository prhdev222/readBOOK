import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types matching your schema
export interface Book {
  id: string
  title: string
  author: string
  description?: string
  category: string
  language: string
  created_at: string
}

export interface BookLink {
  id: string
  book_id: string
  type: 'google_drive' | 'dropbox' | 'onedrive' | 'mega' | 'mediafire' | 'direct' | 'other' | 'youtube' | 'vimeo' | 'soundcloud' | 'spotify' | 'image' | 'audio' | 'video'
  url: string
  title: string
  description?: string
  is_primary: boolean
  is_active: boolean
  media_type: 'file' | 'image' | 'audio' | 'video' | 'youtube' | 'document'
  thumbnail_url?: string
  duration?: number
  file_size?: number
  mime_type?: string
  collection_id?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  created_at: string
}

export interface MediaCollection {
  id: string
  book_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface MediaView {
  id: string
  book_id: string
  book_title: string
  author: string
  category: string
  type: string
  media_type: string
  url: string
  title: string
  description?: string
  thumbnail_url?: string
  duration?: number
  file_size?: number
  mime_type?: string
  is_primary: boolean
  is_active: boolean
  collection_id?: string
  collection_name?: string
  created_at: string
  updated_at: string
}