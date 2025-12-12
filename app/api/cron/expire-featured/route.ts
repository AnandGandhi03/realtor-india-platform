import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Cron job to expire featured listings
// Add to vercel.json: { "crons": [{ "path": "/api/cron/expire-featured", "schedule": "0 0 * * *" }] }

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
    const now = new Date().toISOString()

    // Find expired featured properties
    const { data: expiredProperties, error } = await supabase
      .from('properties')
      .select('id, title, owner_id')
      .eq('featured', true)
      .not('featured_until', 'is', null)
      .lte('featured_until', now)

    if (error) throw error

    if (!expiredProperties || expiredProperties.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No expired featured listings',
      })
    }

    // Unfeatured expired properties
    const { error: updateError } = await supabase
      .from('properties')
      .update({ 
        featured: false,
        featured_until: null,
      })
      .in('id', expiredProperties.map(p => p.id))

    if (updateError) throw updateError

    // TODO: Send notification emails to owners

    return NextResponse.json({
      success: true,
      message: `Expired ${expiredProperties.length} featured listings`,
      count: expiredProperties.length,
    })
  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}