'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'

// Interface cho Category
interface Category {
  id: string
  name: string
}

// Interface cho Project
interface Project {
  id: string
  title: string
  description: string
  category: string // Lưu Category ID
  location: string
  area: number | null
  duration: string | null
  client: string | null
  status: 'draft' | 'published' | 'archived' // Đã thêm archived
  featured: boolean
  images: { id: string; url: string; order: number }[]
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [project, setProject] = useState<Project | null>(null)
  const [images, setImages] = useState<{ id?: string; url: string; order: number }[]>([])
  const [categories, setCategories] = useState<Category[]>([]) // State lưu danh mục
  
  const { toast, hideToast, success, error } = useToast()

  // Fetch dữ liệu khi load trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Categories trước
        const catRes = await fetch('/api/admin/categories')
        if (catRes.ok) {
          const catData = await catRes.json()
          setCategories(catData.categories || [])
        }

        // 2. Fetch Project sau
        if (params.id) {
          const projectRes = await fetch(`/api/admin/projects/${params.id}`)
          if (projectRes.ok) {
            const projectData = await projectRes.json()
            setProject(projectData)
            setImages(projectData.images || [])
          } else {
            // Nếu API trả về 404
            console.error('Project not found')
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    // Validate category
    if (!project.category) {
      error('Please select a category')
      return
    }

    setSaving(true)

    try {
      const res = await fetch(`/api/admin/projects/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...project,
          area: project.area ? Number(project.area) : null, // Đảm bảo area là số
          images: images.map((img, index) => ({
            id: img.id, // Giữ lại ID nếu là ảnh cũ
            url: img.url,
            order: index,
          })),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        success('Project updated successfully!')
        setTimeout(() => router.push('/admin/projects'), 1500)
      } else {
        error(data.error || 'Failed to update project')
      }
    } catch (err) {
      console.error('Error updating project:', err)
      error('Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  // Xử lý thêm ảnh mới
  const handleAddImage = (url: string) => {
    setImages([...images, { url, order: images.length }])
  }

  // Xử lý xóa ảnh
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // Xử lý sắp xếp ảnh
  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return

    ;[newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    setImages(newImages)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading project data...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Project not found</p>
        <button 
          onClick={() => router.push('/admin/projects')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to Projects
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
        <p className="text-gray-600 mt-2">Update project information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={project.category}
                onChange={(e) =>
                  setProject({
                    ...project,
                    category: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No categories found.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={project.location}
                onChange={(e) => setProject({ ...project, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area (m²)
              </label>
              <input
                type="number"
                step="0.01"
                value={project.area || ''}
                onChange={(e) =>
                  setProject({ ...project, area: e.target.value ? parseFloat(e.target.value) : null })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <input
                type="text"
                value={project.duration || ''}
                onChange={(e) => setProject({ ...project, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
              <input
                type="text"
                value={project.client || ''}
                onChange={(e) => setProject({ ...project, client: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Project Images</h2>

          <ImageUploader
            value=""
            onChange={handleAddImage}
            label="Add Image"
            showPreview={false}
          />

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`Project ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'up')}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100"
                        title="Move up"
                      >
                        ↑
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'down')}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100"
                        title="Move down"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status & Settings */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Status & Settings</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={project.status}
              onChange={(e) =>
                setProject({ ...project, status: e.target.value as typeof project.status })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={project.featured}
              onChange={(e) => setProject({ ...project, featured: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
              Mark as featured project
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