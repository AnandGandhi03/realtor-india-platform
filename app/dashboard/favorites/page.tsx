'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, ArrowLeft, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import PropertyCard from '@/components/property/PropertyCard'
import toast from 'react-hot-toast'

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          property:properties(
            *,
            property_images(url, is_primary)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform data for PropertyCard
      const transformedData = data?.map(fav => ({
        favoriteId: fav.id,
        ...fav.property,
        images: fav.property.property_images
          ?.sort((a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
          .map((img: any) => img.url) || [],
        location: fav.property.locality,
      })) || []

      setFavorites(transformedData)
    } catch (error) {
      console.error('Error loading favorites:', error)
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)

      if (error) throw error

      toast.success('Removed from favorites')
      loadFavorites()
    } catch (error) {
      console.error('Error removing favorite:', error)
      toast.error('Failed to remove favorite')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
                <p className="text-sm text-gray-600">{favorites.length} saved properties</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-96 animate-shimmer"></div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring properties and save your favorites
            </p>
            <button
              onClick={() => router.push('/properties')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFavorite(property.favoriteId)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition shadow-lg group"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4 text-red-600 group-hover:scale-110 transition" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}