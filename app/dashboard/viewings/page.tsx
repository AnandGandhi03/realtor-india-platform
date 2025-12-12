'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Phone, ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function ViewingsPage() {
  const router = useRouter()
  const [viewings, setViewings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming')

  useEffect(() => {
    loadViewings()
  }, [filter])

  const loadViewings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      let query = supabase
        .from('viewings')
        .select(`
          *,
          property:properties(*, property_images(url, is_primary)),
          agent:agents(*, user:profiles(full_name, phone, email))
        `)
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: filter === 'past' ? false : true })

      const now = new Date().toISOString()

      if (filter === 'upcoming') {
        query = query.gte('scheduled_at', now).eq('status', 'scheduled')
      } else if (filter === 'past') {
        query = query.or(`scheduled_at.lt.${now},status.eq.completed,status.eq.cancelled`)
      }

      const { data, error } = await query

      if (error) throw error
      setViewings(data || [])
    } catch (error) {
      console.error('Error loading viewings:', error)
      toast.error('Failed to load viewings')
    } finally {
      setLoading(false)
    }
  }

  const cancelViewing = async (viewingId: string) => {
    if (!confirm('Cancel this viewing?')) return

    try {
      const { error } = await supabase
        .from('viewings')
        .update({ status: 'cancelled' })
        .eq('id', viewingId)

      if (error) throw error

      toast.success('Viewing cancelled')
      loadViewings()
    } catch (error) {
      toast.error('Failed to cancel viewing')
    }
  }

  const markCompleted = async (viewingId: string) => {
    try {
      const { error } = await supabase
        .from('viewings')
        .update({ status: 'completed' })
        .eq('id', viewingId)

      if (error) throw error

      toast.success('Viewing marked as completed')
      loadViewings()
    } catch (error) {
      toast.error('Failed to update viewing')
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
              <Calendar className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Viewings</h1>
                <p className="text-sm text-gray-600">{viewings.length} scheduled viewings</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['upcoming', 'past', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-48 animate-shimmer"></div>
            ))}
          </div>
        ) : viewings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No {filter !== 'all' ? filter : ''} viewings
            </h3>
            <p className="text-gray-600 mb-6">
              Schedule a viewing to visit properties in person
            </p>
            <button
              onClick={() => router.push('/properties')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {viewings.map((viewing) => (
              <div key={viewing.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="flex">
                  {/* Property Image */}
                  <div className="relative w-48 h-48 flex-shrink-0">
                    <Image
                      src={viewing.property?.property_images?.find((img: any) => img.is_primary)?.url || '/placeholder.jpg'}
                      alt={viewing.property?.title}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      viewing.status === 'scheduled' ? 'bg-blue-500 text-white' :
                      viewing.status === 'completed' ? 'bg-green-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {viewing.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{viewing.property?.title}</h3>
                        <p className="text-gray-600 flex items-center gap-1 mb-2">
                          <MapPin className="w-4 h-4" />
                          {viewing.property?.locality}, {viewing.property?.city}
                        </p>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="bg-primary-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 text-primary-900 font-semibold">
                        <Clock className="w-5 h-5" />
                        {new Date(viewing.scheduled_at).toLocaleString('en-IN', {
                          dateStyle: 'full',
                          timeStyle: 'short',
                        })}
                      </div>
                    </div>

                    {/* Agent Info */}
                    {viewing.agent && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold">{viewing.agent.user?.full_name}</p>
                          <p className="text-sm text-gray-600">Agent</p>
                        </div>
                        <a
                          href={`tel:${viewing.agent.user?.phone}`}
                          className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200"
                        >
                          <Phone className="w-5 h-5" />
                        </a>
                      </div>
                    )}

                    {/* Notes */}
                    {viewing.notes && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded mb-4">
                        {viewing.notes}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      {viewing.status === 'scheduled' && new Date(viewing.scheduled_at) > new Date() && (
                        <>
                          <button
                            onClick={() => markCompleted(viewing.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Completed
                          </button>
                          <button
                            onClick={() => cancelViewing(viewing.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => router.push(`/properties/${viewing.property?.id}`)}
                        className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                      >
                        View Property
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}