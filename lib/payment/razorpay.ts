// Razorpay Payment Integration for Indian Market

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  theme?: {
    color?: string
  }
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  try {
    const response = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

export const openRazorpayCheckout = async (options: Partial<RazorpayOptions>) => {
  const isLoaded = await loadRazorpayScript()

  if (!isLoaded) {
    throw new Error('Razorpay SDK failed to load')
  }

  const razorpayOptions: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    amount: options.amount || 0,
    currency: options.currency || 'INR',
    name: options.name || 'Realtor India',
    description: options.description || 'Payment',
    order_id: options.order_id || '',
    handler: options.handler || (() => {}),
    prefill: options.prefill || {},
    theme: {
      color: options.theme?.color || '#0ea5e9',
    },
  }

  const razorpay = new window.Razorpay(razorpayOptions)
  razorpay.open()
}

// Payment Plans
export const PAYMENT_PLANS = {
  FEATURED_LISTING: {
    name: 'Featured Listing',
    price: 999,
    duration: 30, // days
    features: [
      'Top placement in search results',
      'Featured badge',
      'Priority support',
      'Enhanced visibility',
    ],
  },
  PREMIUM_LISTING: {
    name: 'Premium Listing',
    price: 1999,
    duration: 60, // days
    features: [
      'All Featured benefits',
      'Homepage showcase',
      'Social media promotion',
      'Dedicated account manager',
      'Analytics dashboard',
    ],
  },
  AGENT_SUBSCRIPTION: {
    name: 'Agent Pro',
    price: 4999,
    duration: 30, // days
    features: [
      'Unlimited listings',
      'Lead management',
      'CRM access',
      'Priority support',
      'Marketing tools',
    ],
  },
}

// Verify payment signature
export const verifyPaymentSignature = async (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  try {
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_id: paymentId,
        signature,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw error
  }
}