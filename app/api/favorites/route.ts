import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// POST /api/favorites - Add to favorites
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

    const { property_id } = await request.json()

    if (!property_id) {
      return NextResponse.json(
        { success: false, error: 'Property ID required' },
        { status: 400 }
      )
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', property_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Already in favorites' },
        { status: 400 }
      )
    }

    // Add to favorites
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        property_id,
      })
      .select()
      .single()

    if (error) throw error

    // Increment favorites count
    await supabase.rpc('increment_favorites', { property_id })

    return NextResponse.json({
      success: true,
      data,
      message: 'Added to favorites',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - Remove from favorites
export async function DELETE(request: NextRequest) {
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
    const property_id = searchParams.get('property_id')

    if (!property_id) {
      return NextResponse.json(
        { success: false, error: 'Property ID required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('property_id', property_id)

    if (error) throw error

    // Decrement favorites count
    await supabase.rpc('decrement_favorites', { property_id })

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}