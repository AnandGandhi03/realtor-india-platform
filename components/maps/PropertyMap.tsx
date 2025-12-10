'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface PropertyMapProps {
  properties: any[]
  center?: [number, number]
  zoom?: number
}

export default function PropertyMap({ 
  properties, 
  center = [20.5937, 78.9629], // Center of India
  zoom = 5 
}: PropertyMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(center, zoom)
    mapRef.current = map

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-2 border-white font-bold">
          ₹
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    })

    // Add markers for properties
    properties.forEach((property) => {
      if (property.latitude && property.longitude) {
        const marker = L.marker([property.latitude, property.longitude], {
          icon: customIcon,
        }).addTo(map)

        // Popup content
        const formatPrice = (price: number) => {
          if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
          if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`
          return `₹${price.toLocaleString('en-IN')}`
        }

        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-sm mb-1">${property.title}</h3>
            <p class="text-primary-600 font-bold">${formatPrice(property.price)}</p>
            <p class="text-xs text-gray-600 mt-1">${property.location}, ${property.city}</p>
            <a href="/properties/${property.id}" class="text-xs text-primary-600 hover:underline mt-2 inline-block">
              View Details →
            </a>
          </div>
        `)
      }
    })

    // Fit bounds to show all markers
    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties
          .filter((p) => p.latitude && p.longitude)
          .map((p) => [p.latitude, p.longitude])
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    }

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [properties, center, zoom])

  return <div ref={mapContainerRef} className="w-full h-full" />
}