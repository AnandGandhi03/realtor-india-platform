'use client'

import { useEffect, useState } from 'react'
import PropertyCard from './PropertyCard'

// Mock data - replace with actual API call
const mockProperties = [
  {
    id: '1',
    title: 'Luxury 3BHK Apartment in Bandra West',
    price: 35000000,
    location: 'Bandra West',
    city: 'Mumbai',
    bedrooms: 3,
    bathrooms: 3,
    carpet_area: 1450,
    property_type: 'apartment',
    listing_type: 'sale',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    featured: true,
  },
  {
    id: '2',
    title: 'Modern Villa with Pool in Whitefield',
    price: 18500000,
    location: 'Whitefield',
    city: 'Bangalore',
    bedrooms: 4,
    bathrooms: 4,
    carpet_area: 2800,
    property_type: 'villa',
    listing_type: 'sale',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    featured: true,
  },
  {
    id: '3',
    title: 'Spacious 2BHK in Cyber City',
    price: 45000,
    location: 'Cyber City',
    city: 'Gurgaon',
    bedrooms: 2,
    bathrooms: 2,
    carpet_area: 1200,
    property_type: 'apartment',
    listing_type: 'rent',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    featured: true,
  },
  {
    id: '4',
    title: 'Premium Office Space in Connaught Place',
    price: 125000,
    location: 'Connaught Place',
    city: 'Delhi',
    bedrooms: 0,
    bathrooms: 2,
    carpet_area: 1800,
    property_type: 'commercial',
    listing_type: 'rent',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    featured: true,
  },
]

export default function FeaturedProperties() {
  const [properties, setProperties] = useState(mockProperties)
  const [loading, setLoading] = useState(false)

  // TODO: Fetch from API
  useEffect(() => {
    // Simulating API call
    setLoading(true)
    setTimeout(() => {
      setProperties(mockProperties)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-xl h-96 animate-shimmer"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}