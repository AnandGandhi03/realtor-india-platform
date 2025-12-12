import { supabase } from '@/lib/supabase/client'

interface UserPreferences {
  budget_min?: number
  budget_max?: number
  preferred_cities?: string[]
  preferred_localities?: string[]
  property_types?: string[]
  min_bedrooms?: number
  max_bedrooms?: number
  furnishing?: string[]
  amenities?: string[]
}

export async function getRecommendations(userId: string, limit: number = 10) {
  try {
    // Get user's viewing history
    const { data: viewings } = await supabase
      .from('viewings')
      .select('property:properties(*)')
      .eq('user_id', userId)
      .limit(20)

    // Get user's favorites
    const { data: favorites } = await supabase
      .from('favorites')
      .select('property:properties(*)')
      .eq('user_id', userId)
      .limit(20)

    // Get user's saved searches
    const { data: searches } = await supabase
      .from('saved_searches')
      .select('search_criteria')
      .eq('user_id', userId)
      .limit(5)

    // Analyze user preferences
    const preferences = analyzeUserPreferences(viewings, favorites, searches)

    // Build recommendation query
    let query = supabase
      .from('properties')
      .select('*, property_images(url, is_primary)')
      .eq('status', 'active')

    // Apply preference filters
    if (preferences.preferred_cities && preferences.preferred_cities.length > 0) {
      query = query.in('city', preferences.preferred_cities)
    }

    if (preferences.property_types && preferences.property_types.length > 0) {
      query = query.in('property_type', preferences.property_types)
    }

    if (preferences.budget_min) {
      query = query.gte('price', preferences.budget_min)
    }

    if (preferences.budget_max) {
      query = query.lte('price', preferences.budget_max)
    }

    if (preferences.min_bedrooms) {
      query = query.gte('bedrooms', preferences.min_bedrooms)
    }

    // Exclude already viewed/favorited
    const viewedIds = viewings?.map(v => v.property.id) || []
    const favoritedIds = favorites?.map(f => f.property.id) || []
    const excludeIds = [...new Set([...viewedIds, ...favoritedIds])]
    
    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error getting recommendations:', error)
    return []
  }
}

function analyzeUserPreferences(
  viewings: any[] | null,
  favorites: any[] | null,
  searches: any[] | null
): UserPreferences {
  const preferences: UserPreferences = {}

  // Analyze viewings and favorites
  const properties = [
    ...(viewings?.map(v => v.property) || []),
    ...(favorites?.map(f => f.property) || []),
  ]

  if (properties.length > 0) {
    // Most common cities
    const cities = properties.map(p => p.city).filter(Boolean)
    preferences.preferred_cities = getMostCommon(cities, 3)

    // Most common property types
    const types = properties.map(p => p.property_type).filter(Boolean)
    preferences.preferred_types = getMostCommon(types, 2)

    // Average budget range
    const prices = properties.map(p => p.price).filter(Boolean)
    if (prices.length > 0) {
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
      preferences.budget_min = Math.floor(avgPrice * 0.7)
      preferences.budget_max = Math.ceil(avgPrice * 1.3)
    }

    // Most common bedroom count
    const bedrooms = properties.map(p => p.bedrooms).filter(Boolean)
    if (bedrooms.length > 0) {
      const avgBedrooms = Math.round(bedrooms.reduce((a, b) => a + b, 0) / bedrooms.length)
      preferences.min_bedrooms = Math.max(1, avgBedrooms - 1)
      preferences.max_bedrooms = avgBedrooms + 1
    }
  }

  // Analyze saved searches
  if (searches && searches.length > 0) {
    searches.forEach(search => {
      const criteria = search.search_criteria
      
      if (criteria.city && !preferences.preferred_cities?.includes(criteria.city)) {
        preferences.preferred_cities = [...(preferences.preferred_cities || []), criteria.city]
      }

      if (criteria.property_type && !preferences.property_types?.includes(criteria.property_type)) {
        preferences.property_types = [...(preferences.property_types || []), criteria.property_type]
      }
    })
  }

  return preferences
}

function getMostCommon<T>(arr: T[], limit: number): T[] {
  const counts = arr.reduce((acc, item) => {
    acc[item as string] = (acc[item as string] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([item]) => item as T)
}

// Calculate similarity score between two properties
export function calculateSimilarity(property1: any, property2: any): number {
  let score = 0

  // Same city (30 points)
  if (property1.city === property2.city) score += 30

  // Same locality (20 points)
  if (property1.locality === property2.locality) score += 20

  // Same property type (15 points)
  if (property1.property_type === property2.property_type) score += 15

  // Similar price (15 points)
  const priceDiff = Math.abs(property1.price - property2.price) / property1.price
  if (priceDiff < 0.2) score += 15
  else if (priceDiff < 0.4) score += 10

  // Same bedrooms (10 points)
  if (property1.bedrooms === property2.bedrooms) score += 10

  // Similar area (10 points)
  if (property1.carpet_area && property2.carpet_area) {
    const areaDiff = Math.abs(property1.carpet_area - property2.carpet_area) / property1.carpet_area
    if (areaDiff < 0.2) score += 10
    else if (areaDiff < 0.4) score += 5
  }

  return score
}

// Get similar properties
export async function getSimilarProperties(propertyId: string, limit: number = 6) {
  try {
    // Get the reference property
    const { data: refProperty } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single()

    if (!refProperty) return []

    // Get properties in same city
    const { data: properties } = await supabase
      .from('properties')
      .select('*, property_images(url, is_primary)')
      .eq('status', 'active')
      .eq('city', refProperty.city)
      .neq('id', propertyId)
      .limit(20)

    if (!properties) return []

    // Calculate similarity scores
    const scored = properties.map(property => ({
      ...property,
      similarity: calculateSimilarity(refProperty, property),
    }))

    // Sort by similarity and return top matches
    return scored
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting similar properties:', error)
    return []
  }
}