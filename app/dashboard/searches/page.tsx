'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, BellOff, Trash2, ArrowLeft, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function SavedSearchesPage() {
  const router = useRouter()
  const [searches, setSearches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewSearch, setShowNewSearch] = useState(false)
  const [newSearchName, setNewSearchName] = useState('')

  useEffect(() => {
    loadSearches()
  }, [])

  const loadSearches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSearches(data || [])
    } catch (error) {
      console.error('Error loading searches:', error)
      toast.error('Failed to load saved searches')
    } finally {
      setLoading(false)
    }
  }

  const toggleAlert = async (searchId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({ alert_enabled: !currentStatus })
        .eq('id', searchId)

      if (error) throw error

      toast.success(`Alerts ${!currentStatus ? 'enabled' : 'disabled'}`)
      loadSearches()
    } catch (error) {
      toast.error('Failed to update alert settings')
    }
  }

  const deleteSearch = async (searchId: string) => {
    if (!confirm('Delete this saved search?')) return

    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId)

      if (error) throw error

      toast.success('Search deleted')
      loadSearches()
    } catch (error) {
      toast.error('Failed to delete search')
    }
  }

  const saveCurrentSearch = async () => {
    if (!newSearchName.trim()) {
      toast.error('Please enter a name for this search')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get current URL params as search criteria
      const params = new URLSearchParams(window.location.search)
      const criteria: any = {}
      params.forEach((value, key) => {
        criteria[key] = value
      })

      const { error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: user.id,
          name: newSearchName,
          search_criteria: criteria,
          alert_enabled: true,
        })

      if (error) throw error

      toast.success('Search saved successfully')
      setShowNewSearch(false)
      setNewSearchName('')
      loadSearches()
    } catch (error) {
      toast.error('Failed to save search')
    }
  }

  const runSearch = (criteria: any) => {
    const params = new URLSearchParams(criteria)
    router.push(`/properties?${params.toString()}`)
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
              <div className="flex items-center gap-3">
                <Search className="w-8 h-8 text-primary-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Saved Searches</h1>
                  <p className="text-sm text-gray-600">{searches.length} saved searches</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowNewSearch(true)}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-5 h-5" />
              Save Current Search
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New Search Modal */}
        {showNewSearch && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Save Current Search</h3>
              <input
                type="text"
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
                placeholder="e.g., 3BHK in Mumbai under 1Cr"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewSearch(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCurrentSearch}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32 animate-shimmer"></div>
            ))}
          </div>
        ) : searches.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No saved searches</h3>
            <p className="text-gray-600 mb-6">
              Save your searches to get alerts when new matching properties are listed
            </p>
            <button
              onClick={() => router.push('/properties')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
            >
              Start Searching
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {searches.map((search) => (
              <div key={search.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold">{search.name}</h3>
                      {search.alert_enabled && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          ALERTS ON
                        </span>
                      )}
                    </div>

                    {/* Search Criteria */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(search.search_criteria).map(([key, value]: [string, any]) => (
                        <span key={key} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                          <span className="font-medium">{key}:</span> {value}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-gray-500">
                      Saved on {new Date(search.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => runSearch(search.search_criteria)}
                      className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200"
                      title="Run Search"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleAlert(search.id, search.alert_enabled)}
                      className={`p-2 rounded-lg ${
                        search.alert_enabled
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={search.alert_enabled ? 'Disable Alerts' : 'Enable Alerts'}
                    >
                      {search.alert_enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => deleteSearch(search.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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