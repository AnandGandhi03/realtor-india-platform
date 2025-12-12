import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Realtor India - Find Your Dream Property',
  description: 'Modern property listing platform for Indian real estate market. Search, buy, sell, and rent properties across India.',
  keywords: 'real estate, property, buy house, rent apartment, India property, MLS, property listing, real estate India',
  authors: [{ name: 'Realtor India' }],
  openGraph: {
    title: 'Realtor India - Find Your Dream Property',
    description: 'Modern property listing platform for Indian real estate market',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}