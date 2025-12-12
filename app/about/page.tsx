import { Shield, Users, TrendingUp, Award, Target, Heart } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Realtor India</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            India's most trusted property listing platform, connecting millions of buyers, sellers, and agents across the country
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To revolutionize the Indian real estate market by providing a transparent, efficient, and user-friendly platform that empowers everyone to find their dream property with confidence.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Trust & Transparency',
                description: 'Every listing is verified with RERA compliance and legal documentation',
              },
              {
                icon: Users,
                title: 'Customer First',
                description: 'We prioritize user experience and satisfaction above everything else',
              },
              {
                icon: TrendingUp,
                title: 'Innovation',
                description: 'Leveraging technology to make property search smarter and faster',
              },
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-primary-200">Active Properties</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-primary-200">Verified Agents</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-primary-200">Cities Covered</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1M+</div>
              <div className="text-primary-200">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Realtor India</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Award,
                title: 'RERA Verified Listings',
                description: 'All properties are verified with Real Estate Regulatory Authority compliance',
              },
              {
                icon: Target,
                title: 'Smart Search Technology',
                description: 'AI-powered recommendations and advanced filters to find your perfect match',
              },
              {
                icon: Heart,
                title: 'Dedicated Support',
                description: '24/7 customer support to assist you throughout your property journey',
              },
              {
                icon: Shield,
                title: 'Secure Transactions',
                description: 'Safe and secure payment processing with industry-standard encryption',
              },
            ].map((feature, index) => (
              <div key={index} className="flex gap-4 bg-white p-6 rounded-xl shadow-sm">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied users who found their dream property with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Browse Properties
            </Link>
            <Link
              href="/signup"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-primary-600"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}