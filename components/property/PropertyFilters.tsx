'use client'

import { IndianRupee, Home, Bed, Bath, Sofa } from 'lucide-react'

interface PropertyFiltersProps {
  filters: any
  setFilters: (filters: any) => void
}

export default function PropertyFilters({ filters, setFilters }: PropertyFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  const resetFilters = () => {
    setFilters({
      location: '',
      type: '',
      listing_type: 'buy',
      budget: '',
      bedrooms: '',
      bathrooms: '',
      furnishing: '',
    })
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        {/* Property Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Home className="w-4 h-4" />
            Property Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="independent_house">Independent House</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
            <option value="office">Office</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <IndianRupee className="w-4 h-4" />
            Budget
          </label>
          <select
            value={filters.budget}
            onChange={(e) => updateFilter('budget', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Any Budget</option>
            <option value="0-2000000">Under ₹20 Lakh</option>
            <option value="2000000-5000000">₹20L - ₹50L</option>
            <option value="5000000-10000000">₹50L - ₹1 Cr</option>
            <option value="10000000-50000000">₹1 Cr - ₹5 Cr</option>
            <option value="50000000-999999999">Above ₹5 Cr</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Bed className="w-4 h-4" />
            Bedrooms
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['1', '2', '3', '4+'].map((bhk) => (
              <button
                key={bhk}
                onClick={() => updateFilter('bedrooms', bhk)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
                  filters.bedrooms === bhk
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                }`}
              >
                {bhk}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Bath className="w-4 h-4" />
            Bathrooms
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['1', '2', '3', '4+'].map((bath) => (
              <button
                key={bath}
                onClick={() => updateFilter('bathrooms', bath)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
                  filters.bathrooms === bath
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                }`}
              >
                {bath}
              </button>
            ))}
          </div>
        </div>

        {/* Furnishing */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Sofa className="w-4 h-4" />
            Furnishing
          </label>
          <select
            value={filters.furnishing}
            onChange={(e) => updateFilter('furnishing', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Any</option>
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="fully-furnished">Fully-Furnished</option>
          </select>
        </div>
      </div>
    </div>
  )
}