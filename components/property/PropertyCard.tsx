'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Bed, Bath, Square, IndianRupee } from 'lucide-react'
import { useState } from 'react'

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: number
    location: string
    city: string
    bedrooms?: number
    bathrooms?: number
    carpet_area?: number
    property_type: string
    listing_type: string
    images: string[]
    featured?: boolean
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`
    }
    return `₹${price.toLocaleString('en-IN')}`
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorite(!isFavorite)
    // TODO: Add to favorites in database
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={property.images[0] || '/placeholder-property.jpg'}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.featured && (
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Featured
              </span>
            )}
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
              For {property.listing_type}
            </span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Price */}
          <div className="flex items-center gap-1 text-2xl font-bold text-primary-600 mb-2">
            <IndianRupee className="w-6 h-6" />
            {formatPrice(property.price)}
            {property.listing_type === 'rent' && (
              <span className="text-sm text-gray-500 font-normal">/month</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-gray-900">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm line-clamp-1">
              {property.location}, {property.city}
            </span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-gray-700 border-t pt-4">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span className="text-sm">{property.bedrooms} BHK</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span className="text-sm">{property.bathrooms}</span>
              </div>
            )}
            {property.carpet_area && (
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span className="text-sm">{property.carpet_area} sq.ft</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}