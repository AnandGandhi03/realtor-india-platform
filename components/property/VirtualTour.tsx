'use client'

import { useState } from 'react'
import { Play, Pause, Maximize, Volume2, VolumeX, RotateCw } from 'lucide-react'

interface VirtualTourProps {
  tourUrl?: string
  images: string[]
  propertyTitle: string
}

export default function VirtualTour({ tourUrl, images, propertyTitle }: VirtualTourProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Auto-play slideshow
  useState(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  })

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const toggleFullscreen = () => {
    const elem = document.getElementById('virtual-tour')
    if (!elem) return

    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <RotateCw className="w-6 h-6 text-primary-600" />
          Virtual Tour
        </h2>
      </div>

      <div id="virtual-tour" className="relative bg-black">
        {/* Main Display */}
        {tourUrl ? (
          // 360° Virtual Tour (Matterport, etc.)
          <iframe
            src={tourUrl}
            className="w-full h-[600px]"
            allowFullScreen
            title={`Virtual tour of ${propertyTitle}`}
          />
        ) : (
          // Image Slideshow
          <div className="relative h-[600px]">
            <img
              src={images[currentImageIndex]}
              alt={`${propertyTitle} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full">
              <button
                onClick={togglePlay}
                className="text-white hover:text-primary-400 transition"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <div className="flex items-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-primary-400 transition"
              >
                <Maximize className="w-6 h-6" />
              </button>
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      <div className="p-4 bg-gray-50 overflow-x-auto">
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                index === currentImageIndex
                  ? 'border-primary-600 scale-110'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Tour Info */}
      <div className="p-6 bg-blue-50 border-t">
        <h3 className="font-semibold text-blue-900 mb-2">Virtual Tour Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use arrow keys or click arrows to navigate</li>
          <li>• Click play for automatic slideshow</li>
          <li>• Click fullscreen for immersive experience</li>
          <li>• Click thumbnails to jump to specific views</li>
        </ul>
      </div>
    </div>
  )
}