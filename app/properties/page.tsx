'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PropertyCard from '@/components/property/PropertyCard'
import PropertyFilters from '@/components/property/PropertyFilters'
import PropertyMap from '@/components/maps/PropertyMap'
import { LayoutGrid, Map } from 'lucide-react'

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    listing_type: searchParams.get('listing_type') || 'buy',
    budget: searchParams.get('budget') || '',
    bedrooms: '',
    bathrooms: '',
    furnishing: '',
  })

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
      latitude: 19.0596,
      longitude: 72.8295,
    },
    // Add more mock properties...
  ]

  useEffect(() => {
    // TODO: Fetch properties from API based on filters
    setLoading(true)
    setTimeout(() => {
      setProperties(mockProperties)
      setLoading(false)
    }, 500)
  }, [filters])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Properties for {filters.listing_type === 'buy' ? 'Sale' : 'Rent'}
            </h1>
            <p className="text-gray-600 mt-1">
              {properties.length} properties found
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded ${
                viewMode === 'map'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Map className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <PropertyFilters filters={filters} setFilters={setFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-200 rounded-xl h-96 animate-shimmer"></div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )
            ) : (
              <div className="h-[calc(100vh-200px)] rounded-xl overflow-hidden">
                <PropertyMap properties={properties} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}