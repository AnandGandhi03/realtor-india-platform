'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Home, Users, TrendingUp, DollarSign, 
  CheckCircle, XCircle, Clock, Eye 
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    pendingProperties: 0,
    totalUsers: 0,
    totalAgents: 0,
    totalLeads: 0,
    totalRevenue: 0,
  })
  const [pendingProperties, setPendingProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminAccess()
    loadDashboardData()
  }, [])

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      toast.error('Access denied')
      router.push('/dashboard')
    }
  }

  const loadDashboardData = async () => {
    try {
      // Get properties stats
      const { data: properties } = await supabase
        .from('properties')
        .select('status')

      const totalProperties = properties?.length || 0
      const activeProperties = properties?.filter(p => p.status === 'active').length || 0
      const pendingProperties = properties?.filter(p => p.status === 'pending').length || 0

      // Get users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Get agents count
      const { count: totalAgents } = await supabase
        .from('agents')
        .select('*', { count: 'exact', head: true })

      // Get leads count
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalProperties,
        activeProperties,
        pendingProperties,
        totalUsers: totalUsers || 0,
        totalAgents: totalAgents || 0,
        totalLeads: totalLeads || 0,
        totalRevenue: 0, // TODO: Calculate from payments
      })

      // Load pending properties
      const { data: pending } = await supabase
        .from('properties')
        .select('*, owner:profiles!owner_id(full_name, email)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10)

      setPendingProperties(pending || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'active', verified: true })
        .eq('id', propertyId)

      if (error) throw error

      toast.success('Property approved')
      loadDashboardData()
    } catch (error) {
      toast.error('Failed to approve property')
    }
  }

  const rejectProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'inactive' })
        .eq('id', propertyId)

      if (error) throw error

      toast.success('Property rejected')
      loadDashboardData()
    } catch (error) {
      toast.error('Failed to reject property')
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.totalProperties}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Properties</h3>
            <p className="text-sm text-gray-500 mt-1">
              {stats.activeProperties} active, {stats.pendingProperties} pending
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.totalUsers}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Users</h3>
            <p className="text-sm text-gray-500 mt-1">
              {stats.totalAgents} agents
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.totalLeads}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Leads</h3>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Revenue</h3>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Pending Approvals</h2>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              {stats.pendingProperties} pending
            </span>
          </div>

          {pendingProperties.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pending approvals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProperties.map((property) => (
                <div key={property.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {property.locality}, {property.city} • ₹{property.price.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Owner: {property.owner?.full_name} ({property.owner?.email})
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted: {new Date(property.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => router.push(`/properties/${property.id}`)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => approveProperty(property.id)}
                        className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => rejectProperty(property.id)}
                        className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}