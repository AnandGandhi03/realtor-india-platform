import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { emailService } from '@/lib/email/send'

// This endpoint should be called by a cron job (Vercel Cron or external)
// Add to vercel.json: { "crons": [{ "path": "/api/cron/check-alerts", "schedule": "0 9 * * *" }] }

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get all saved searches with alerts enabled
    const { data: searches } = await supabase
      .from('saved_searches')
      .select('*, user:profiles(email, full_name)')
      .eq('alert_enabled', true)

    if (!searches || searches.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active alerts',
      })
    }

    let totalAlertsSent = 0

    // Check each saved search for new properties
    for (const search of searches) {
      const criteria = search.search_criteria
      const lastChecked = search.last_checked_at || search.created_at

      // Build query based on criteria
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .gte('created_at', lastChecked)

      // Apply search criteria
      if (criteria.city) query = query.eq('city', criteria.city)
      if (criteria.property_type) query = query.eq('property_type', criteria.property_type)
      if (criteria.listing_type) query = query.eq('listing_type', criteria.listing_type)
      if (criteria.min_price) query = query.gte('price', criteria.min_price)
      if (criteria.max_price) query = query.lte('price', criteria.max_price)
      if (criteria.bedrooms) query = query.eq('bedrooms', criteria.bedrooms)

      const { data: newProperties } = await query.limit(10)

      // If new properties found, send alert
      if (newProperties && newProperties.length > 0) {
        await emailService.sendSavedSearchAlert(
          search.user.email,
          search.user.full_name || 'User',
          newProperties
        )

        // Update last checked timestamp
        await supabase
          .from('saved_searches')
          .update({ last_checked_at: new Date().toISOString() })
          .eq('id', search.id)

        totalAlertsSent++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${totalAlertsSent} alerts`,
      totalSearches: searches.length,
      alertsSent: totalAlertsSent,
    })
  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}