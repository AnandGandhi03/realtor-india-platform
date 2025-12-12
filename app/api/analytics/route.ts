import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'property' or 'dashboard'
    const propertyId = searchParams.get('property_id')

    if (type === 'property' && propertyId) {
      // Property-specific analytics
      const { data: property } = await supabase
        .from('properties')
        .select('views, favorites_count')
        .eq('id', propertyId)
        .eq('owner_id', user.id)
        .single()

      if (!property) {
        return NextResponse.json(
          { success: false, error: 'Property not found' },
          { status: 404 }
        )
      }

      // Get leads count
      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId)

      // Get viewings count
      const { count: viewingsCount } = await supabase
        .from('viewings')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId)

      return NextResponse.json({
        success: true,
        data: {
          views: property.views || 0,
          favorites: property.favorites_count || 0,
          leads: leadsCount || 0,
          viewings: viewingsCount || 0,
        },
      })
    } else {
      // Dashboard analytics
      const { data: properties } = await supabase
        .from('properties')
        .select('id, views, favorites_count, status')
        .eq('owner_id', user.id)

      const propertyIds = properties?.map(p => p.id) || []

      // Get total leads
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .in('property_id', propertyIds)

      // Get total viewings
      const { count: totalViewings } = await supabase
        .from('viewings')
        .select('*', { count: 'exact', head: true })
        .in('property_id', propertyIds)

      // Calculate totals
      const totalViews = properties?.reduce((sum, p) => sum + (p.views || 0), 0) || 0
      const totalFavorites = properties?.reduce((sum, p) => sum + (p.favorites_count || 0), 0) || 0
      const activeProperties = properties?.filter(p => p.status === 'active').length || 0

      return NextResponse.json({
        success: true,
        data: {
          totalProperties: properties?.length || 0,
          activeProperties,
          totalViews,
          totalFavorites,
          totalLeads: totalLeads || 0,
          totalViewings: totalViewings || 0,
          properties: properties?.map(p => ({
            id: p.id,
            views: p.views || 0,
            favorites: p.favorites_count || 0,
          })),
        },
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}