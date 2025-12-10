'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, IndianRupee } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const [searchType, setSearchType] = useState<'buy' | 'rent'>('buy')
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [budget, setBudget] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (propertyType) params.set('type', propertyType)
    if (budget) params.set('budget', budget)
    params.set('listing_type', searchType)
    
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto">
      {/* Buy/Rent Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSearchType('buy')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
            searchType === 'buy'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSearchType('rent')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
            searchType === 'rent'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Rent
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="City, Locality, or Project"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
          />
        </div>

        {/* Property Type */}
        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none text-gray-900"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="independent_house">Independent House</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Budget */}
        <div className="relative">
          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none text-gray-900"
          >
            <option value="">Budget</option>
            <option value="0-2000000">Under ₹20 Lakh</option>
            <option value="2000000-5000000">₹20L - ₹50L</option>
            <option value="5000000-10000000">₹50L - ₹1 Cr</option>
            <option value="10000000-50000000">₹1 Cr - ₹5 Cr</option>
            <option value="50000000-999999999">Above ₹5 Cr</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          Search
        </button>
      </form>
    </div>
  )
}