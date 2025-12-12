'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { getRecommendations } from '@/lib/ai/recommendations'
import PropertyCard from '@/components/property/PropertyCard'

export default function RecommendationsPage() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const data = await getRecommendations(user.id, 12)
      
      // Transform for PropertyCard
      const transformed = data.map(property => ({
        ...property,
        images: property.property_images
          ?.sort((a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
          .map((img: any) => img.url) || [],
        location: property.locality,
      }))

      setRecommendations(transformed)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Recommended For You</h1>
            </div>
          </div>
          <p className="text-primary-100 ml-16">
            Personalized property recommendations based on your preferences and activity
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-96 animate-shimmer"></div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No recommendations yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start browsing properties to get personalized recommendations
            </p>
            <button
              onClick={() => router.push('/properties')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-900 font-medium">
                ✨ We found {recommendations.length} properties that match your preferences
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}