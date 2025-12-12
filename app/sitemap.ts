import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://realtorindiaplatform.com'

  // Static pages
  const staticPages = [
    '',
    '/properties',
    '/compare',
    '/premium',
    '/login',
    '/signup',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Get all active properties
  const { data: properties } = await supabase
    .from('properties')
    .select('id, updated_at')
    .eq('status', 'active')
    .limit(1000)

  const propertyPages = (properties || []).map((property) => ({
    url: `${baseUrl}/properties/${property.id}`,
    lastModified: new Date(property.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // City pages
  const cities = ['mumbai', 'bangalore', 'delhi', 'pune', 'hyderabad', 'chennai']
  const cityPages = cities.map((city) => ({
    url: `${baseUrl}/properties?city=${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...propertyPages, ...cityPages]
}