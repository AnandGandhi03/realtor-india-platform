'use client'

import { useState } from 'react'
import { Check, Star, Zap, Crown } from 'lucide-react'
import { openRazorpayCheckout, PAYMENT_PLANS } from '@/lib/payment/razorpay'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function PremiumPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (planKey: keyof typeof PAYMENT_PLANS) => {
    setLoading(planKey)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please login to continue')
        return
      }

      const plan = PAYMENT_PLANS[planKey]

      // Create order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plan.price * 100, // Convert to paise
          currency: 'INR',
          receipt: `${planKey}_${Date.now()}`,
          notes: {
            plan: planKey,
            user_id: user.id,
          },
        }),
      })

      const { data: order } = await response.json()

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', user.id)
        .single()

      // Open Razorpay checkout
      await openRazorpayCheckout({
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Realtor India',
        description: plan.name,
        prefill: {
          name: profile?.full_name,
          email: profile?.email,
          contact: profile?.phone,
        },
        handler: async (response: any) => {
          // Verify payment
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          })

          const { success } = await verifyResponse.json()

          if (success) {
            toast.success('Payment successful! Your plan is now active.')
            // TODO: Activate premium features
          } else {
            toast.error('Payment verification failed')
          }
        },
      })
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Boost Your Property Visibility
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get more views, leads, and faster sales with our premium plans
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Featured Listing */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-8 h-8 text-yellow-500" />
              <h3 className="text-2xl font-bold">Featured</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹{PAYMENT_PLANS.FEATURED_LISTING.price}</span>
              <span className="text-gray-600">/{PAYMENT_PLANS.FEATURED_LISTING.duration} days</span>
            </div>
            <ul className="space-y-3 mb-8">
              {PAYMENT_PLANS.FEATURED_LISTING.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePurchase('FEATURED_LISTING')}
              disabled={loading === 'FEATURED_LISTING'}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
            >
              {loading === 'FEATURED_LISTING' ? 'Processing...' : 'Get Featured'}
            </button>
          </div>

          {/* Premium Listing */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-2xl p-8 text-white transform scale-105 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              MOST POPULAR
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-8 h-8 text-yellow-300" />
              <h3 className="text-2xl font-bold">Premium</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹{PAYMENT_PLANS.PREMIUM_LISTING.price}</span>
              <span className="text-primary-200">/{PAYMENT_PLANS.PREMIUM_LISTING.duration} days</span>
            </div>
            <ul className="space-y-3 mb-8">
              {PAYMENT_PLANS.PREMIUM_LISTING.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePurchase('PREMIUM_LISTING')}
              disabled={loading === 'PREMIUM_LISTING'}
              className="w-full bg-white text-primary-600 py-3 rounded-lg font-semibold hover:bg-primary-50 transition disabled:opacity-50"
            >
              {loading === 'PREMIUM_LISTING' ? 'Processing...' : 'Go Premium'}
            </button>
          </div>

          {/* Agent Subscription */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold">Agent Pro</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹{PAYMENT_PLANS.AGENT_SUBSCRIPTION.price}</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {PAYMENT_PLANS.AGENT_SUBSCRIPTION.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePurchase('AGENT_SUBSCRIPTION')}
              disabled={loading === 'AGENT_SUBSCRIPTION'}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading === 'AGENT_SUBSCRIPTION' ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-center mb-12">Why Go Premium?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">10x More Views</h3>
              <p className="text-gray-600">
                Premium listings get 10 times more views than regular listings
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sell 3x Faster</h3>
              <p className="text-gray-600">
                Premium properties sell or rent 3 times faster on average
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Priority Support</h3>
              <p className="text-gray-600">
                Get dedicated support and assistance throughout your journey
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How does payment work?',
                a: 'We use Razorpay, India\'s most trusted payment gateway. All transactions are secure and encrypted.',
              },
              {
                q: 'Can I cancel my subscription?',
                a: 'Yes, you can cancel anytime. Your premium features will remain active until the end of the billing period.',
              },
              {
                q: 'What happens after my plan expires?',
                a: 'Your listing will revert to a regular listing. You can renew anytime to regain premium benefits.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 7-day money-back guarantee if you\'re not satisfied with the results.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TrendingUp(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}