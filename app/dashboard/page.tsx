'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, Heart, Search, Calendar, TrendingUp, 
  Plus, LogOut, User, Settings, Bell 
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    favorites: 0,
    savedSearches: 0,
    viewings: 0,
    myProperties: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profile)

      // Get stats
      const [favorites, searches, viewings, properties] = await Promise.all([
        supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('saved_searches').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('viewings').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('properties').select('id', { count: 'exact' }).eq('owner_id', user.id),
      ])

      setStats({
        favorites: favorites.count || 0,
        savedSearches: searches.count || 0,
        viewings: viewings.count || 0,
        myProperties: properties.count || 0,
      })
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Realtor India
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.full_name || 'User'}!
          </h1>
          <p className="text-primary-100 mb-6">
            {profile?.role === 'buyer' && 'Find your dream property today'}
            {profile?.role === 'seller' && 'Manage your property listings'}
            {profile?.role === 'agent' && 'Manage your clients and properties'}
          </p>
          <div className="flex gap-4">
            <Link
              href="/properties"
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Browse Properties
            </Link>
            {(profile?.role === 'seller' || profile?.role === 'agent') && (
              <Link
                href="/list-property"
                className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition border-2 border-white"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                List Property
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/favorites" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.favorites}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Favorites</h3>
          </Link>

          <Link href="/dashboard/searches" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.savedSearches}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Saved Searches</h3>
          </Link>

          <Link href="/dashboard/viewings" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.viewings}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Viewings</h3>
          </Link>

          {(profile?.role === 'seller' || profile?.role === 'agent') && (
            <Link href="/my-properties" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Home className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stats.myProperties}</span>
              </div>
              <h3 className="text-gray-600 font-medium">My Properties</h3>
            </Link>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Heart className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Saved a property</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Scheduled a viewing</p>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Edit Profile</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Account Settings</span>
              </Link>
              <Link
                href="/dashboard/notifications"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Notification Preferences</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}