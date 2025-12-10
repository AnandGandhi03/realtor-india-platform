export type UserRole = 'buyer' | 'seller' | 'agent' | 'builder' | 'admin'

export type PropertyType = 
  | 'apartment' 
  | 'villa' 
  | 'independent_house' 
  | 'plot' 
  | 'commercial' 
  | 'office' 
  | 'shop' 
  | 'warehouse' 
  | 'farmhouse' 
  | 'penthouse' 
  | 'studio'

export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented' | 'inactive'

export type ListingType = 'sale' | 'rent' | 'lease' | 'pg'

export type FurnishingType = 'unfurnished' | 'semi-furnished' | 'fully-furnished'

export type FacingDirection = 
  | 'north' 
  | 'south' 
  | 'east' 
  | 'west' 
  | 'north-east' 
  | 'north-west' 
  | 'south-east' 
  | 'south-west'

export interface Property {
  id: string
  title: string
  description: string
  property_type: PropertyType
  listing_type: ListingType
  status: PropertyStatus
  price: number
  price_per_sqft?: number
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
  furnishing?: FurnishingType
  parking?: number
  age_of_property?: number
  facing?: FacingDirection
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
  images?: PropertyImage[]
  amenities?: Amenity[]
  owner?: Profile
  agent?: Agent
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  caption?: string
  is_primary: boolean
  display_order: number
  created_at: string
}

export interface Amenity {
  id: string
  name: string
  category: 'building' | 'society' | 'nearby'
  icon?: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  role: UserRole
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface Agent {
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
  user?: Profile
}

export interface Favorite {
  id: string
  user_id: string
  property_id: string
  created_at: string
  property?: Property
}

export interface SavedSearch {
  id: string
  user_id: string
  name: string
  search_criteria: Record<string, any>
  alert_enabled: boolean
  created_at: string
  updated_at: string
}

export interface Viewing {
  id: string
  property_id: string
  user_id: string
  agent_id?: string
  scheduled_at: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
  property?: Property
  agent?: Agent
}

export interface Lead {
  id: string
  property_id: string
  user_id?: string
  agent_id?: string
  name: string
  email?: string
  phone: string
  message?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source?: string
  created_at: string
  updated_at: string
  property?: Property
}

export interface Review {
  id: string
  property_id?: string
  agent_id?: string
  user_id: string
  rating: number
  comment?: string
  created_at: string
  user?: Profile
}

export interface Neighborhood {
  id: string
  name: string
  city: string
  state: string
  description?: string
  avg_price_per_sqft?: number
  schools_count: number
  hospitals_count: number
  restaurants_count: number
  transport_score?: number
  safety_score?: number
  created_at: string
  updated_at: string
}