'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Home, Users, TrendingUp, Calendar, 
  Phone, Mail, MapPin, IndianRupee,
  CheckCircle, Clock, XCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AgentDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalLeads: 0,
    newLeads: 0,
    scheduledViewings: 0,
    completedViewings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  })
  const [recentLeads, setRecentLeads] = useState<any[]>([])
  const [upcomingViewings, setUpcomingViewings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAgentAccess()
    loadDashboardData()
  }, [])

  const checkAgentAccess = async () => {
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

    if (profile?.role !== 'agent') {
      toast.error('Access denied - Agents only')
      router.push('/dashboard')
    }
  }

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get agent profile
      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!agent) return

      // Get properties stats
      const { data: properties } = await supabase
        .from('properties')
        .select('status, price, listing_type')
        .eq('agent_id', agent.id)

      const totalListings = properties?.length || 0
      const activeListings = properties?.filter(p => p.status === 'active').length || 0

      // Get leads
      const propertyIds = properties?.map(p => p.id) || []
      
      const { data: leads } = await supabase
        .from('leads')
        .select('*, property:properties(title, city)')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false })

      const totalLeads = leads?.length || 0
      const newLeads = leads?.filter(l => l.status === 'new').length || 0

      // Get viewings
      const { data: viewings } = await supabase
        .from('viewings')
        .select('*, property:properties(title, locality, city)')
        .eq('agent_id', agent.id)
        .order('scheduled_at', { ascending: true })

      const now = new Date()
      const scheduledViewings = viewings?.filter(v => 
        v.status === 'scheduled' && new Date(v.scheduled_at) > now
      ).length || 0
      
      const completedViewings = viewings?.filter(v => v.status === 'completed').length || 0

      setStats({
        totalListings,
        activeListings,
        totalLeads,
        newLeads,
        scheduledViewings,
        completedViewings,
        totalRevenue: 0,
        monthlyRevenue: 0,
      })

      setRecentLeads(leads?.slice(0, 5) || [])
      setUpcomingViewings(viewings?.filter(v => 
        v.status === 'scheduled' && new Date(v.scheduled_at) > now
      ).slice(0, 5) || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId)

      if (error) throw error

      toast.success('Lead status updated')
      loadDashboardData()
    } catch (error) {
      toast.error('Failed to update lead')
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
            <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
            <Link
              href="/list-property"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Add Property
            </Link>
          </div>
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
              <span className="text-3xl font-bold">{stats.totalListings}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Listings</h3>
            <p className="text-sm text-gray-500 mt-1">{stats.activeListings} active</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold">{stats.totalLeads}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Leads</h3>
            <p className="text-sm text-gray-500 mt-1">{stats.newLeads} new</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold">{stats.scheduledViewings}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Scheduled Viewings</h3>
            <p className="text-sm text-gray-500 mt-1">{stats.completedViewings} completed</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <IndianRupee className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-3xl font-bold">₹{stats.monthlyRevenue.toLocaleString('en-IN')}</span>
            </div>
            <h3 className="text-gray-600 font-medium">This Month</h3>
            <p className="text-sm text-gray-500 mt-1">Revenue</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Recent Leads</h2>
            {recentLeads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No leads yet
              </div>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{lead.name}</h3>
                        <p className="text-sm text-gray-600">{lead.property?.title}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        lead.status === 'new' ? 'bg-green-100 text-green-700' :
                        lead.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {lead.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-primary-600">
                        <Phone className="w-4 h-4" />
                        {lead.phone}
                      </a>
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-primary-600">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </a>
                      )}
                    </div>
                    {lead.message && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded mb-3">
                        {lead.message}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateLeadStatus(lead.id, 'contacted')}
                        className="flex-1 text-sm bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200"
                      >
                        Mark Contacted
                      </button>
                      <button
                        onClick={() => updateLeadStatus(lead.id, 'qualified')}
                        className="flex-1 text-sm bg-green-100 text-green-700 py-2 rounded hover:bg-green-200"
                      >
                        Qualified
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Viewings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Upcoming Viewings</h2>
            {upcomingViewings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No upcoming viewings
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingViewings.map((viewing) => (
                  <div key={viewing.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{viewing.property?.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {viewing.property?.locality}, {viewing.property?.city}
                        </p>
                      </div>
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="bg-primary-50 p-3 rounded mb-3">
                      <p className="text-sm font-semibold text-primary-900">
                        {new Date(viewing.scheduled_at).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                    {viewing.notes && (
                      <p className="text-sm text-gray-600 mb-3">{viewing.notes}</p>
                    )}
                    <button
                      className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 text-sm"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}