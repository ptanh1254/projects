'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatusBadge from '@/components/admin/StatusBadge'
import ConfirmModal from '@/components/admin/ConfirmModal'

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  buttonText: string | null
  buttonLink: string | null
  imageUrl: string | null
  order: number
  active: boolean
  createdAt: string
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; slideId: string | null }>({
    isOpen: false,
    slideId: null,
  })

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/admin/hero-slides')
      if (res.ok) {
        const data = await res.json()
        setSlides(data)
      }
    } catch (error) {
      console.error('Error fetching slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchSlides()
      }
    } catch (error) {
      console.error('Error deleting slide:', error)
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      })

      if (res.ok) {
        fetchSlides()
      }
    } catch (error) {
      console.error('Error toggling slide:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-gray-600 mt-2">Manage homepage hero slideshow</p>
        </div>
        <Link
          href="/admin/hero-slides/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Add New Slide
        </Link>
      </div>

      {/* Slides List */}
      <div className="bg-white rounded-lg shadow">
        {slides.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No slides yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first hero slide</p>
            <Link
              href="/admin/hero-slides/new"
              className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add New Slide
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {slides.map((slide) => (
              <div key={slide.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Image Preview */}
                <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-blue-800">
                  {slide.imageUrl ? (
                    <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={slide.active ? 'Active' : 'Inactive'} />
                  </div>
                  <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                    Order: {slide.order}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{slide.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{slide.subtitle}</p>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/hero-slides/${slide.id}/edit`}
                      className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggleActive(slide.id, slide.active)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                    >
                      {slide.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, slideId: slide.id })}
                      className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, slideId: null })}
        onConfirm={() => deleteModal.slideId && handleDelete(deleteModal.slideId)}
        title="Delete Slide"
        message="Are you sure you want to delete this slide? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}
