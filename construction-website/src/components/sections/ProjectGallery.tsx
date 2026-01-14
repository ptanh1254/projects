'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import Modal from '@/components/ui/Modal'

interface GalleryImage {
  id: string
  url: string
  publicId: string
  order: number
}

interface ProjectGalleryProps {
  images: GalleryImage[]
  projectTitle: string
  className?: string
}

export default function ProjectGallery({
  images,
  projectTitle,
  className,
}: ProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length)
  }

  const goToPrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  if (!sortedImages.length) {
    return (
      <div className={cn('bg-gray-100 rounded-lg p-12 text-center', className)}>
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-500">No images available for this project</p>
      </div>
    )
  }

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* Main Featured Image */}
        {sortedImages.length > 0 && (
          <div
            className="relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={sortedImages[0].url}
              alt={`${projectTitle} - Main Image`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Thumbnail Grid */}
        {sortedImages.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sortedImages.slice(1).map((image, idx) => (
              <div
                key={image.id}
                className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(idx + 1)}
              >
                <Image
                  src={image.url}
                  alt={`${projectTitle} - Image ${idx + 2}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                    <svg
                      className="w-6 h-6 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        title={`${projectTitle} - Image ${currentImageIndex + 1} of ${sortedImages.length}`}
        size="full"
      >
        <div className="relative h-full flex flex-col">
          {/* Main Image Display */}
          <div className="flex-1 relative min-h-0 bg-black">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative w-full h-full">
                <Image
                  src={sortedImages[currentImageIndex].url}
                  alt={`${projectTitle} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Navigation Arrows */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {sortedImages.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {sortedImages.length > 1 && (
            <div className="bg-gray-900 p-4 overflow-x-auto">
              <div className="flex gap-2 justify-center min-w-max mx-auto">
                {sortedImages.map((image, idx) => (
                  <button
                    key={image.id}
                    onClick={() => goToImage(idx)}
                    className={cn(
                      'relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all',
                      currentImageIndex === idx
                        ? 'ring-4 ring-blue-500 opacity-100'
                        : 'opacity-60 hover:opacity-100'
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
