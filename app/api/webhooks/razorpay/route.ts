import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get webhook signature
    const signature = request.headers.get('x-razorpay-signature')
    const body = await request.text()

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)

    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity, supabase)
        break

      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity, supabase)
        break

      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity, supabase)
        break

      default:
        console.log('Unhandled event type:', event.event)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function handlePaymentCaptured(payment: any, supabase: any) {
  // Update payment record
  await supabase
    .from('payments')
    .update({
      payment_id: payment.id,
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('order_id', payment.order_id)

  // Activate premium features based on payment notes
  const notes = payment.notes
  if (notes?.plan && notes?.user_id) {
    await activatePremiumPlan(notes.user_id, notes.plan, supabase)
  }
}

async function handlePaymentFailed(payment: any, supabase: any) {
  await supabase
    .from('payments')
    .update({
      payment_id: payment.id,
      status: 'failed',
    })
    .eq('order_id', payment.order_id)
}

async function handleOrderPaid(order: any, supabase: any) {
  console.log('Order paid:', order.id)
}

async function activatePremiumPlan(userId: string, plan: string, supabase: any) {
  const planDurations: Record<string, number> = {
    FEATURED_LISTING: 30,
    PREMIUM_LISTING: 60,
    AGENT_SUBSCRIPTION: 30,
  }

  const duration = planDurations[plan] || 30
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + duration)

  // Create subscription record
  await supabase.from('subscriptions').insert({
    user_id: userId,
    plan_type: plan,
    status: 'active',
    started_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
  })

  // If property-specific plan, mark property as featured/premium
  if (plan === 'FEATURED_LISTING' || plan === 'PREMIUM_LISTING') {
    // Get user's most recent property
    const { data: property } = await supabase
      .from('properties')
      .select('id')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (property) {
      await supabase
        .from('properties')
        .update({
          featured: true,
          featured_until: expiresAt.toISOString(),
        })
        .eq('id', property.id)
    }
  }
}