'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { 
  MapPin, Bed, Bath, Square, Calendar, Home, 
  Heart, Share2, Phone, Mail, IndianRupee,
  Building, Car, Compass, Shield
} from 'lucide-react'
import PropertyMap from '@/components/maps/PropertyMap'
import ContactForm from '@/components/property/ContactForm'
import MortgageCalculator from '@/components/property/MortgageCalculator'

export default function PropertyDetailsPage() {
  const params = useParams()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Mock data - replace with actual API call
  useEffect(() => {
    setTimeout(() => {
      setProperty({
        id: params.id,
        title: 'Luxury 3BHK Apartment in Bandra West',
        description: 'Spacious and well-ventilated 3BHK apartment in the heart of Bandra West. This premium property offers modern amenities, excellent connectivity, and a vibrant neighborhood. Perfect for families looking for comfort and convenience.',
        price: 35000000,
        location: 'Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        bedrooms: 3,
        bathrooms: 3,
        balconies: 2,
        carpet_area: 1450,
        built_up_area: 1650,
        total_floors: 15,
        floor_number: 8,
        property_type: 'apartment',
        listing_type: 'sale',
        furnishing: 'semi-furnished',
        parking: 2,
        age_of_property: 2,
        facing: 'North-East',
        possession_status: 'ready-to-move',
        rera_id: 'P51900012345',
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
        ],
        amenities: [
          'Swimming Pool', 'Gym', 'Security', 'Power Backup',
          'Lift', 'Garden', 'Club House', 'Parking'
        ],
        latitude: 19.0596,
        longitude: 72.8295,
        agent: {
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          email: 'rajesh@realtors.com',
          avatar: 'https://i.pravatar.cc/150?img=12'
        }
      })
      setLoading(false)
    }, 500)
  }, [params.id])

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Crore`
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakh`
    return `₹${price.toLocaleString('en-IN')}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="col-span-3 relative h-[500px] rounded-xl overflow-hidden">
            <Image
              src={property.images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              {property.images.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-1 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-rows-4 gap-4">
            {property.images.slice(1, 5).map((img: string, index: number) => (
              <div
                key={index}
                className="relative h-full rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setCurrentImageIndex(index + 1)}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{property.location}, {property.city}, {property.state}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-primary-600">
                  {formatPrice(property.price)}
                </span>
                <span className="text-gray-600">
                  (₹{Math.round(property.price / property.carpet_area).toLocaleString('en-IN')}/sq.ft)
                </span>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-4 gap-4 py-4 border-t border-b">
                <div className="text-center">
                  <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">{property.bedrooms} BHK</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Square className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">{property.carpet_area}</div>
                  <div className="text-sm text-gray-600">Sq.ft</div>
                </div>
                <div className="text-center">
                  <Car className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">{property.parking}</div>
                  <div className="text-sm text-gray-600">Parking</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About this property</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Property Type', value: property.property_type, icon: Home },
                  { label: 'Carpet Area', value: `${property.carpet_area} sq.ft`, icon: Square },
                  { label: 'Built-up Area', value: `${property.built_up_area} sq.ft`, icon: Building },
                  { label: 'Floor', value: `${property.floor_number} of ${property.total_floors}`, icon: Building },
                  { label: 'Furnishing', value: property.furnishing, icon: Home },
                  { label: 'Facing', value: property.facing, icon: Compass },
                  { label: 'Age', value: `${property.age_of_property} years`, icon: Calendar },
                  { label: 'RERA ID', value: property.rera_id, icon: Shield },
                ].map((detail, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <detail.icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-600">{detail.label}</div>
                      <div className="font-semibold capitalize">{detail.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Amenities</h2>
              <div className="grid md:grid-cols-3 gap-3">
                {property.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <div className="h-96 rounded-lg overflow-hidden">
                <PropertyMap properties={[property]} center={[property.latitude, property.longitude]} zoom={15} />
              </div>
            </div>

            {/* Mortgage Calculator */}
            <MortgageCalculator propertyPrice={property.price} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
              <h3 className="font-bold text-lg mb-4">Contact Agent</h3>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <div className="font-semibold">{property.agent.name}</div>
                  <div className="text-sm text-gray-600">Verified Agent</div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center gap-2 p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Agent</span>
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email Agent</span>
                </a>
              </div>

              <ContactForm propertyId={property.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}