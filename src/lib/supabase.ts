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
  type: 'google_drive' | 'dropbox' | 'onedrive' | 'mega' | 'mediafire' | 'direct' | 'other'
  url: string
  title: string
  is_primary: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  created_at: string
}