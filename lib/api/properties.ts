import { supabase, Property } from '@/lib/supabase/client'

export interface PropertyFilters {
  city?: string
  locality?: string
  property_type?: string
  listing_type?: string
  min_price?: number
  max_price?: number
  bedrooms?: number
  bathrooms?: number
  furnishing?: string
  min_area?: number
  max_area?: number
}

export async function getProperties(filters: PropertyFilters = {}, page = 1, limit = 12) {
  let query = supabase
    .from('properties')
    .select('*, property_images(url, is_primary)', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  // Apply filters
  if (filters.city) query = query.eq('city', filters.city)
  if (filters.locality) query = query.eq('locality', filters.locality)
  if (filters.property_type) query = query.eq('property_type', filters.property_type)
  if (filters.listing_type) query = query.eq('listing_type', filters.listing_type)
  if (filters.min_price) query = query.gte('price', filters.min_price)
  if (filters.max_price) query = query.lte('price', filters.max_price)
  if (filters.bedrooms) query = query.eq('bedrooms', filters.bedrooms)
  if (filters.bathrooms) query = query.eq('bathrooms', filters.bathrooms)
  if (filters.furnishing) query = query.eq('furnishing', filters.furnishing)
  if (filters.min_area) query = query.gte('carpet_area', filters.min_area)
  if (filters.max_area) query = query.lte('carpet_area', filters.max_area)

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) throw error

  return {
    properties: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      property_images(url, caption, is_primary, display_order),
      property_amenities(amenity:amenities(name, category, icon)),
      owner:profiles!owner_id(full_name, phone, email, avatar_url),
      agent:agents!agent_id(*, user:profiles(full_name, phone, email, avatar_url))
    `)
    .eq('id', id)
    .single()

  if (error) throw error

  // Increment view count
  await supabase
    .from('properties')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', id)

  return data
}

export async function getFeaturedProperties(limit = 8) {
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images(url, is_primary)')
    .eq('status', 'active')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function searchProperties(query: string, limit = 10) {
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images(url, is_primary)')
    .eq('status', 'active')
    .textSearch('search_vector', query)
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function addToFavorites(userId: string, propertyId: string) {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, property_id: propertyId })

  if (error) throw error

  // Increment favorites count
  await supabase.rpc('increment_favorites', { property_id: propertyId })
}

export async function removeFromFavorites(userId: string, propertyId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId)

  if (error) throw error

  // Decrement favorites count
  await supabase.rpc('decrement_favorites', { property_id: propertyId })
}

export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('property:properties(*, property_images(url, is_primary))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data?.map(f => f.property) || []
}

export async function createLead(leadData: {
  property_id: string
  user_id?: string
  agent_id?: string
  name: string
  email?: string
  phone: string
  message?: string
  source?: string
}) {
  const { data, error } = await supabase
    .from('leads')
    .insert(leadData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function scheduleViewing(viewingData: {
  property_id: string
  user_id: string
  agent_id?: string
  scheduled_at: string
  notes?: string
}) {
  const { data, error } = await supabase
    .from('viewings')
    .insert(viewingData)
    .select()
    .single()

  if (error) throw error
  return data
}