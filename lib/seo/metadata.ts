import { Metadata } from 'next'

export function generatePropertyMetadata(property: any): Metadata {
  const title = `${property.title} - ${property.city} | Realtor India`
  const description = property.description.slice(0, 160)
  const images = property.property_images?.map((img: any) => img.url) || []

  return {
    title,
    description,
    keywords: [
      property.property_type,
      property.city,
      property.locality,
      `${property.bedrooms} BHK`,
      property.listing_type,
      'real estate',
      'property',
      'India',
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_IN',
      images: images.slice(0, 4),
      siteName: 'Realtor India',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.slice(0, 1),
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/properties/${property.id}`,
    },
  }
}

export function generateStructuredData(property: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/properties/${property.id}`,
    image: property.property_images?.map((img: any) => img.url) || [],
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.locality,
      addressRegion: property.state,
      postalCode: property.pincode,
      addressCountry: 'IN',
    },
    geo: property.latitude && property.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude,
    } : undefined,
    numberOfRooms: property.bedrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.carpet_area,
      unitCode: 'SQF',
    },
  }
}