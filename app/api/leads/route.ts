import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { emailService } from '@/lib/email/send'

// POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    const { property_id, name, email, phone, message } = body

    // Validate required fields
    if (!property_id || !name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get current user (optional)
    const { data: { user } } = await supabase.auth.getUser()

    // Get property details
    const { data: property } = await supabase
      .from('properties')
      .select('*, owner:profiles!owner_id(full_name, email)')
      .eq('id', property_id)
      .single()

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    // Create lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        property_id,
        user_id: user?.id,
        name,
        email,
        phone,
        message,
        status: 'new',
        source: 'website',
      })
      .select()
      .single()

    if (error) throw error

    // Send email notification to property owner
    if (property.owner?.email) {
      await emailService.sendNewLeadEmail(
        property.owner.email,
        property.owner.full_name || 'Property Owner',
        name,
        phone,
        email || '',
        property.title,
        message || ''
      )
    }

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Your inquiry has been sent successfully!',
    })
  } catch (error: any) {
    console.error('Lead creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// GET /api/leads - Get user's leads
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
    const type = searchParams.get('type') // 'received' or 'sent'

    let query = supabase
      .from('leads')
      .select('*, property:properties(title, city, locality)')
      .order('created_at', { ascending: false })

    if (type === 'received') {
      // Leads for properties owned by user
      const { data: properties } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', user.id)

      const propertyIds = properties?.map(p => p.id) || []
      query = query.in('property_id', propertyIds)
    } else {
      // Leads created by user
      query = query.eq('user_id', user.id)
    }

    const { data, error } = await query

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