import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { emailService } from '@/lib/email/send'

// POST /api/viewings - Schedule viewing
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { property_id, scheduled_at, notes } = body

    if (!property_id || !scheduled_at) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get property and agent details
    const { data: property } = await supabase
      .from('properties')
      .select(`
        *,
        agent:agents!agent_id(*, user:profiles(full_name, phone))
      `)
      .eq('id', property_id)
      .single()

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    // Create viewing
    const { data: viewing, error } = await supabase
      .from('viewings')
      .insert({
        property_id,
        user_id: user.id,
        agent_id: property.agent_id,
        scheduled_at,
        notes,
        status: 'scheduled',
      })
      .select()
      .single()

    if (error) throw error

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    // Send confirmation email
    if (profile?.email) {
      await emailService.sendViewingScheduledEmail(
        profile.email,
        profile.full_name || 'User',
        property.title,
        new Date(scheduled_at).toLocaleString('en-IN'),
        property.agent?.user?.full_name || 'Agent',
        property.agent?.user?.phone || ''
      )
    }

    return NextResponse.json({
      success: true,
      data: viewing,
      message: 'Viewing scheduled successfully!',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// GET /api/viewings - Get user's viewings
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

    const { data, error } = await supabase
      .from('viewings')
      .select(`
        *,
        property:properties(title, city, locality, property_images(url, is_primary)),
        agent:agents(*, user:profiles(full_name, phone))
      `)
      .eq('user_id', user.id)
      .order('scheduled_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}