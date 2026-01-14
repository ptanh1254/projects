'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'

interface Service {
  id: string
  title: string
  shortDescription: string
  description: string
  icon: string | null
  imageUrl: string | null
  order: number
  active: boolean
}

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [service, setService] = useState<Service | null>(null)
  const { toast, hideToast, success, error } = useToast()

  useEffect(() => {
    fetchService()
  }, [params.id])

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/admin/services/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setService(data)
      } else {
        error('Failed to load service')
      }
    } catch (err) {
      console.error('Error fetching service:', err)
      error('Failed to load service')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!service) return

    setSaving(true)

    try {
      const res = await fetch(`/api/admin/services/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      })

      const data = await res.json()

      if (res.ok) {
        success('Service updated successfully!')
        setTimeout(() => router.push('/admin/services'), 1500)
      } else {
        error(data.error || 'Failed to update service')
      }
    } catch (err) {
      console.error('Error updating service:', err)
      error('Failed to update service')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Service not found</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
        <p className="text-gray-600 mt-2">Update service information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={service.title}
              onChange={(e) => setService({ ...service, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description <span className="text-red-500">*</span>
              <span className="text-gray-500 font-normal ml-2">(Max 300 characters)</span>
            </label>
            <textarea
              required
              maxLength={300}
              value={service.shortDescription}
              onChange={(e) => setService({ ...service, shortDescription: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              {service.shortDescription.length}/300 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={service.description}
              onChange={(e) => setService({ ...service, description: e.target.value })}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Media</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon Name</label>
            <input
              type="text"
              value={service.icon || ''}
              onChange={(e) => setService({ ...service, icon: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="building, tools, paint-brush (Font Awesome icons)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a Font Awesome icon name (e.g., building, hammer, wrench)
            </p>
          </div>

          <ImageUploader
            value={service.imageUrl || ''}
            onChange={(url) => setService({ ...service, imageUrl: url })}
            onRemove={() => setService({ ...service, imageUrl: null })}
            label="Service Image"
          />
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={service.order}
              onChange={(e) => setService({ ...service, order: parseInt(e.target.value) || 0 })}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Lower numbers appear first
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={service.active}
              onChange={(e) => setService({ ...service, active: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="active" className="ml-2 text-sm text-gray-700">
              Active (visible on website)
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      {toast.isVisible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  )
}
