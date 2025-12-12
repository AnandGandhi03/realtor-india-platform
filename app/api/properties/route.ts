import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/properties - List properties with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const searchParams = request.nextUrl.searchParams

    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const city = searchParams.get('city')
    const locality = searchParams.get('locality')
    const propertyType = searchParams.get('property_type')
    const listingType = searchParams.get('listing_type')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const furnishing = searchParams.get('furnishing')
    const minArea = searchParams.get('min_area')
    const maxArea = searchParams.get('max_area')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
      .from('properties')
      .select('*, property_images(url, is_primary)', { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    // Apply filters
    if (city) query = query.eq('city', city)
    if (locality) query = query.eq('locality', locality)
    if (propertyType) query = query.eq('property_type', propertyType)
    if (listingType) query = query.eq('listing_type', listingType)
    if (minPrice) query = query.gte('price', parseInt(minPrice))
    if (maxPrice) query = query.lte('price', parseInt(maxPrice))
    if (bedrooms) query = query.eq('bedrooms', parseInt(bedrooms))
    if (bathrooms) query = query.eq('bathrooms', parseInt(bathrooms))
    if (furnishing) query = query.eq('furnishing', furnishing)
    if (minArea) query = query.gte('carpet_area', parseInt(minArea))
    if (maxArea) query = query.lte('carpet_area', parseInt(maxArea))
    if (featured === 'true') query = query.eq('featured', true)
    if (search) query = query.textSearch('search_vector', search)

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: {
        properties: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/properties - Create new property
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

    // Create property
    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...body,
        owner_id: user.id,
        status: 'pending',
        price_per_sqft: body.carpet_area ? body.price / body.carpet_area : null,
      })
      .select()
      .single()

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