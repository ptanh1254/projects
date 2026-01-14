'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'

interface Media {
  id: string
  url: string
  publicId: string
  projectId: string | null
  order: number
  createdAt: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; mediaId: string | null }>({
    isOpen: false,
    mediaId: null,
  })
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const { toast, hideToast, success, error } = useToast()

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) {
        const data = await res.json()
        setMedia(data)
      } else {
        error('Failed to load media')
      }
    } catch (err) {
      console.error('Error fetching media:', err)
      error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      let uploadedCount = 0
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          uploadedCount++
        }
      }

      if (uploadedCount > 0) {
        success(`${uploadedCount} image${uploadedCount > 1 ? 's' : ''} uploaded successfully`)
        fetchMedia()
      } else {
        error('Failed to upload files')
      }
    } catch (err) {
      console.error('Error uploading files:', err)
      error('Failed to upload files')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        success('Media deleted successfully')
        fetchMedia()
        setDeleteModal({ isOpen: false, mediaId: null })
        if (selectedMedia?.id === id) {
          setSelectedMedia(null)
        }
      } else {
        const data = await res.json()
        error(data.error || 'Failed to delete media')
      }
    } catch (err) {
      console.error('Error deleting media:', err)
      error('Failed to delete media')
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    success('URL copied to clipboard!')
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
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-2">Manage your uploaded images</p>
        </div>
        <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer">
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      {media.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No media files yet</h3>
          <p className="text-gray-500 mb-6">Upload images to get started</p>
          <label className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer">
            Upload Images
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              <Image src={item.url} alt="Media" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteModal({ isOpen: true, mediaId: item.id })
                  }}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedMedia(null)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Media Details</h2>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image src={selectedMedia.url} alt="Media" fill className="object-contain" />
              </div>

              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">URL</dt>
                  <dd className="mt-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={selectedMedia.url}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedMedia.url)}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      Copy
                    </button>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Uploaded</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedMedia.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{selectedMedia.id}</dd>
                </div>
              </dl>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setDeleteModal({ isOpen: true, mediaId: selectedMedia.id })
                    setSelectedMedia(null)
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, mediaId: null })}
        onConfirm={() => deleteModal.mediaId && handleDelete(deleteModal.mediaId)}
        title="Delete Media"
        message="Are you sure you want to delete this media file? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* Toast Notification */}
      {toast.isVisible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  )
}
