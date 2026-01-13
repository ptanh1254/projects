'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'

export default function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [slideId, setSlideId] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    imageUrl: null as string | null,
    imagePublicId: null as string | null,
    order: 0,
    active: true,
  })

  useEffect(() => {
    async function fetchSlide() {
      try {
        const { id } = await params
        setSlideId(id)
        console.log('Fetching slide with ID:', id)
        const res = await fetch(`/api/admin/hero-slides/${id}`)
        console.log('Response status:', res.status)

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          console.error('Error response:', errorData)
          throw new Error(errorData.error || 'Failed to fetch slide')
        }

        const data = await res.json()
        console.log('Slide data:', data)

        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          buttonText: data.buttonText || '',
          buttonLink: data.buttonLink || '',
          imageUrl: data.imageUrl || null,
          imagePublicId: data.imagePublicId || null,
          order: data.order || 0,
          active: data.active ?? true,
        })
      } catch (error: any) {
        console.error('Error fetching slide:', error)
        setError(error.message || 'Failed to load slide')
      } finally {
        setFetching(false)
      }
    }

    fetchSlide()
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/hero-slides/${slideId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update slide')
      }

      router.push('/admin/hero-slides')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <Link href="/admin/hero-slides" className="hover:text-gray-900">
            Hero Slides
          </Link>
          <span>/</span>
          <span>Edit Slide</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Hero Slide</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle *
            </label>
            <textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Button Text */}
          <div>
            <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-2">
              Button Text
            </label>
            <input
              type="text"
              id="buttonText"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Button Link */}
          <div>
            <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-700 mb-2">
              Button Link
            </label>
            <input
              type="text"
              id="buttonLink"
              value={formData.buttonLink}
              onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Image Upload */}
          <ImageUploader
            value={formData.imageUrl}
            onChange={(url, publicId) =>
              setFormData({ ...formData, imageUrl: url, imagePublicId: publicId })
            }
            onRemove={() => setFormData({ ...formData, imageUrl: null, imagePublicId: null })}
            label="Background Image (Optional)"
          />

          {/* Order */}
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <input
              type="number"
              id="order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">Lower numbers appear first</p>
          </div>

          {/* Active */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
              Active (Show on website)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <Link
              href="/admin/hero-slides"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
