import Link from 'next/link'
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-8 h-8 text-primary-400" />
              <span className="text-2xl font-bold text-white">Realtor India</span>
            </div>
            <p className="text-sm mb-4">
              India's most trusted property listing platform. Find your dream home with verified listings and expert agents.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties" className="hover:text-primary-400">Browse Properties</Link></li>
              <li><Link href="/properties?listing_type=sale" className="hover:text-primary-400">Buy</Link></li>
              <li><Link href="/properties?listing_type=rent" className="hover:text-primary-400">Rent</Link></li>
              <li><Link href="/list-property" className="hover:text-primary-400">List Property</Link></li>
              <li><Link href="/compare" className="hover:text-primary-400">Compare Properties</Link></li>
              <li><Link href="/premium" className="hover:text-primary-400">Premium Plans</Link></li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Cities</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties?city=mumbai" className="hover:text-primary-400">Mumbai</Link></li>
              <li><Link href="/properties?city=bangalore" className="hover:text-primary-400">Bangalore</Link></li>
              <li><Link href="/properties?city=delhi" className="hover:text-primary-400">Delhi NCR</Link></li>
              <li><Link href="/properties?city=pune" className="hover:text-primary-400">Pune</Link></li>
              <li><Link href="/properties?city=hyderabad" className="hover:text-primary-400">Hyderabad</Link></li>
              <li><Link href="/properties?city=chennai" className="hover:text-primary-400">Chennai</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>123 Business Park, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-primary-400">+91 123 456 7890</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:support@realtorindiaplatform.com" className="hover:text-primary-400">
                  support@realtorindiaplatform.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © {currentYear} Realtor India. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="hover:text-primary-400">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary-400">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-primary-400">Cookie Policy</Link>
              <Link href="/sitemap" className="hover:text-primary-400">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}