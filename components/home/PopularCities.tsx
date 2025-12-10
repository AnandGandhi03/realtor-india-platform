'use client'

import Link from 'next/link'
import Image from 'next/image'

const cities = [
  {
    name: 'Mumbai',
    properties: '15,234',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
  },
  {
    name: 'Bangalore',
    properties: '12,456',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800',
  },
  {
    name: 'Delhi NCR',
    properties: '18,789',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
  },
  {
    name: 'Pune',
    properties: '8,234',
    image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800',
  },
  {
    name: 'Hyderabad',
    properties: '9,567',
    image: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800',
  },
  {
    name: 'Chennai',
    properties: '7,890',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
  },
]

export default function PopularCities() {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
      {cities.map((city) => (
        <Link
          key={city.name}
          href={`/properties?city=${city.name.toLowerCase()}`}
          className="group relative overflow-hidden rounded-xl aspect-square"
        >
          <Image
            src={city.image}
            alt={city.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-lg mb-1">{city.name}</h3>
            <p className="text-sm text-gray-200">{city.properties} properties</p>
          </div>
        </Link>
      ))}
    </div>
  )
}