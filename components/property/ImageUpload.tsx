'use client'

import { useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  images: File[]
  setImages: (images: File[]) => void
  maxImages?: number
}

export default function ImageUpload({ images, setImages, maxImages = 10 }: ImageUploadProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validate file types
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isUnder10MB = file.size <= 10 * 1024 * 1024 // 10MB
      
      if (!isImage) {
        alert(`${file.name} is not an image file`)
        return false
      }
      if (!isUnder10MB) {
        alert(`${file.name} is larger than 10MB`)
        return false
      }
      return true
    })

    // Check max images limit
    const remainingSlots = maxImages - images.length
    const filesToAdd = validFiles.slice(0, remainingSlots)
    
    if (validFiles.length > remainingSlots) {
      alert(`You can only upload ${maxImages} images. ${validFiles.length - remainingSlots} files were not added.`)
    }

    setImages([...images, ...filesToAdd])
  }, [images, maxImages, setImages])

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    setImages(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition">
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={images.length >= maxImages}
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {images.length >= maxImages ? 'Maximum images reached' : 'Upload Property Images'}
          </p>
          <p className="text-sm text-gray-500">
            Click to browse or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-2">
            PNG, JPG, WEBP up to 10MB ({images.length}/{maxImages} images)
          </p>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
            >
              <Image
                src={URL.createObjectURL(image)}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              
              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Primary
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move Left */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                    title="Move left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Move Right */}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                    title="Move right"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Image Number */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      {images.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Image Upload Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Upload high-quality images for better visibility</li>
            <li>• First image will be the primary/cover image</li>
            <li>• Include exterior, interior, and amenity photos</li>
            <li>• Drag images to reorder them</li>
            <li>• Recommended: At least 5 images</li>
          </ul>
        </div>
      )}
    </div>
  )
}