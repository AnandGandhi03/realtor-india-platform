'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff, TrendingUp, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import PropertyCard from '@/components/property/PropertyCard'
import toast from 'react-hot-toast'

export default function MyPropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'sold'>('all')

  useEffect(() => {
    loadProperties()
  }, [filter])

  const loadProperties = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      let query = supabase
        .from('properties')
        .select('*, property_images(url, is_primary)')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error

      // Transform data for PropertyCard
      const transformedData = data?.map(property => ({
        ...property,
        images: property.property_images
          ?.sort((a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
          .map((img: any) => img.url) || [],
        location: property.locality,
      })) || []

      setProperties(transformedData)
    } catch (error) {
      console.error('Error loading properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)

      if (error) throw error

      toast.success('Property deleted successfully')
      loadProperties()
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
    }
  }

  const toggleStatus = async (propertyId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', propertyId)

      if (error) throw error

      toast.success(`Property ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
      loadProperties()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    pending: properties.filter(p => p.status === 'pending').length,
    sold: properties.filter(p => p.status === 'sold').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
            </div>
            <Link
              href="/list-property"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              List New Property
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total</span>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Active</span>
              <Eye className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Pending</span>
              <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Sold/Rented</span>
              <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.sold}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'pending', 'sold'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-96 animate-shimmer"></div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-6">
              Start by listing your first property
            </p>
            <Link
              href="/list-property"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              <Plus className="w-5 h-5" />
              List Property
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => toggleStatus(property.id, property.status)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition shadow-lg"
                    title={property.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {property.status === 'active' ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  
                  <Link
                    href={`/edit-property/${property.id}`}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition shadow-lg"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition shadow-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    property.status === 'active' ? 'bg-green-500 text-white' :
                    property.status === 'pending' ? 'bg-yellow-500 text-white' :
                    property.status === 'sold' ? 'bg-blue-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {property.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}