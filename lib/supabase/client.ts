import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Property = {
  id: string
  title: string
  description: string
  property_type: string
  listing_type: string
  status: string
  price: number
  price_per_sqft: number
  maintenance_cost?: number
  security_deposit?: number
  address: string
  locality: string
  city: string
  state: string
  pincode: string
  latitude?: number
  longitude?: number
  bedrooms?: number
  bathrooms?: number
  balconies?: number
  total_floors?: number
  floor_number?: number
  carpet_area?: number
  built_up_area?: number
  plot_area?: number
  furnishing?: string
  parking?: number
  age_of_property?: number
  facing?: string
  owner_id: string
  agent_id?: string
  rera_id?: string
  possession_status?: string
  available_from?: string
  views: number
  favorites_count: number
  featured: boolean
  verified: boolean
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  email: string
  full_name?: string
  phone?: string
  role: 'buyer' | 'seller' | 'agent' | 'builder' | 'admin'
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export type Agent = {
  id: string
  user_id: string
  agency_name?: string
  license_number?: string
  experience_years?: number
  specialization?: string[]
  rating: number
  total_reviews: number
  total_sales: number
  verified: boolean
  service_areas?: string[]
  languages?: string[]
  created_at: string
  updated_at: string
}