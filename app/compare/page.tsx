'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, X, Plus, Check, Minus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'
import { formatIndianPrice, formatArea } from '@/lib/utils/formatters'

export default function ComparePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProperties()
  }, [searchParams])

  const loadProperties = async () => {
    const ids = searchParams.get('ids')?.split(',') || []
    
    if (ids.length === 0) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(url, is_primary), property_amenities(amenity:amenities(name))')
        .in('id', ids)

      if (error) throw error

      setProperties(data || [])
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeProperty = (id: string) => {
    const ids = searchParams.get('ids')?.split(',').filter(i => i !== id) || []
    if (ids.length === 0) {
      router.push('/properties')
    } else {
      router.push(`/compare?ids=${ids.join(',')}`)
    }
  }

  const comparisonRows = [
    { label: 'Price', key: 'price', format: (val: number) => formatIndianPrice(val) },
    { label: 'Property Type', key: 'property_type', format: (val: string) => val.replace('_', ' ').toUpperCase() },
    { label: 'Listing Type', key: 'listing_type', format: (val: string) => val.toUpperCase() },
    { label: 'Bedrooms', key: 'bedrooms', format: (val: number) => val || 'N/A' },
    { label: 'Bathrooms', key: 'bathrooms', format: (val: number) => val || 'N/A' },
    { label: 'Carpet Area', key: 'carpet_area', format: (val: number) => val ? formatArea(val) : 'N/A' },
    { label: 'Built-up Area', key: 'built_up_area', format: (val: number) => val ? formatArea(val) : 'N/A' },
    { label: 'Price per sq.ft', key: 'price_per_sqft', format: (val: number) => val ? `₹${val.toLocaleString('en-IN')}` : 'N/A' },
    { label: 'Furnishing', key: 'furnishing', format: (val: string) => val?.replace('-', ' ').toUpperCase() || 'N/A' },
    { label: 'Parking', key: 'parking', format: (val: number) => val || 'N/A' },
    { label: 'Age', key: 'age_of_property', format: (val: number) => val ? `${val} years` : 'N/A' },
    { label: 'Floor', key: 'floor_number', format: (val: number, prop: any) => val && prop.total_floors ? `${val} of ${prop.total_floors}` : 'N/A' },
    { label: 'Facing', key: 'facing', format: (val: string) => val?.toUpperCase() || 'N/A' },
    { label: 'Location', key: 'locality', format: (val: string, prop: any) => `${val}, ${prop.city}` },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No properties to compare</h2>
          <button
            onClick={() => router.push('/properties')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Browse Properties
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Compare Properties ({properties.length})
              </h1>
            </div>
            {properties.length < 4 && (
              <button
                onClick={() => router.push('/properties')}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-5 h-5" />
                Add More
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left font-semibold bg-gray-50 sticky left-0 z-10">
                  Feature
                </th>
                {properties.map((property) => (
                  <th key={property.id} className="p-4 min-w-[300px]">
                    <div className="relative">
                      {/* Remove Button */}
                      <button
                        onClick={() => removeProperty(property.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Property Image */}
                      <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                        <Image
                          src={property.property_images?.find((img: any) => img.is_primary)?.url || property.property_images?.[0]?.url || '/placeholder.jpg'}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Property Title */}
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        {property.title}
                      </h3>

                      {/* View Details Button */}
                      <button
                        onClick={() => router.push(`/properties/${property.id}`)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr key={row.key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-4 font-semibold sticky left-0 z-10 bg-inherit">
                    {row.label}
                  </td>
                  {properties.map((property) => {
                    const value = property[row.key]
                    const formattedValue = row.format(value, property)
                    
                    // Highlight best value for numeric comparisons
                    let isBest = false
                    if (row.key === 'price' || row.key === 'price_per_sqft') {
                      const values = properties.map(p => p[row.key]).filter(v => v)
                      isBest = value && value === Math.min(...values)
                    } else if (row.key === 'carpet_area' || row.key === 'built_up_area') {
                      const values = properties.map(p => p[row.key]).filter(v => v)
                      isBest = value && value === Math.max(...values)
                    }

                    return (
                      <td key={property.id} className={`p-4 ${isBest ? 'bg-green-50 font-semibold text-green-700' : ''}`}>
                        {isBest && <Check className="w-4 h-4 inline mr-2 text-green-600" />}
                        {formattedValue}
                      </td>
                    )
                  })}
                </tr>
              ))}

              {/* Amenities Row */}
              <tr className="bg-white">
                <td className="p-4 font-semibold sticky left-0 z-10 bg-white">
                  Amenities
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4">
                    <div className="space-y-1">
                      {property.property_amenities?.slice(0, 5).map((pa: any, i: number) => (
                        <div key={i} className="text-sm flex items-center gap-2">
                          <Check className="w-3 h-3 text-green-600" />
                          {pa.amenity.name}
                        </div>
                      ))}
                      {property.property_amenities?.length > 5 && (
                        <div className="text-sm text-gray-500">
                          +{property.property_amenities.length - 5} more
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Winner Summary */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-green-900 mb-2">Best Price</h3>
            <p className="text-sm text-green-700">
              {properties.reduce((best, p) => 
                !best || (p.price && p.price < best.price) ? p : best
              , null)?.title}
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">Largest Area</h3>
            <p className="text-sm text-blue-700">
              {properties.reduce((best, p) => 
                !best || (p.carpet_area && p.carpet_area > (best.carpet_area || 0)) ? p : best
              , null)?.title}
            </p>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
            <h3 className="font-bold text-purple-900 mb-2">Best Value</h3>
            <p className="text-sm text-purple-700">
              {properties.reduce((best, p) => 
                !best || (p.price_per_sqft && p.price_per_sqft < (best.price_per_sqft || Infinity)) ? p : best
              , null)?.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}