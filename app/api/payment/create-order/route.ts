import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

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

    const { amount, currency, receipt, notes } = await request.json()

    if (!amount) {
      return NextResponse.json(
        { success: false, error: 'Amount is required' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    })

    // Save order to database
    await supabase.from('payments').insert({
      user_id: user.id,
      order_id: order.id,
      amount: amount / 100, // Convert back to rupees
      currency: order.currency,
      status: 'created',
    })

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error: any) {
    console.error('Payment order creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}