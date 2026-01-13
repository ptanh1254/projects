'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageUploaderProps {
  value: string | null
  onChange: (url: string, publicId: string) => void
  onRemove: () => void
  label?: string
}

export default function ImageUploader({ value, onChange, onRemove, label = 'Image' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const uploadFile = async (file: File) => {
    console.log('=== START UPLOAD ===')
    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      console.log('1. Starting upload...', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB')

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      console.log('2. Upload status:', res.status, res.statusText)

      if (!res.ok) {
        const errorText = await res.text()
        console.error('3. Upload error response:', errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText || 'Upload failed' }
        }

        throw new Error(errorData.error || 'Upload failed')
      }

      const responseText = await res.text()
      console.log('4. Raw response:', responseText)

      const data = JSON.parse(responseText)
      console.log('5. Parsed response:', data)

      // Handle both response formats
      const imageUrl = data.image?.url || data.url
      const imagePublicId = data.image?.publicId || data.publicId

      console.log('6. Extracted URL:', imageUrl, 'PublicId:', imagePublicId)

      if (!imageUrl) {
        console.error('7. ERROR: No URL found in response:', data)
        throw new Error('No image URL in response')
      }

      console.log('8. Calling onChange with:', imageUrl, imagePublicId)
      onChange(imageUrl, imagePublicId || '')
      console.log('9. Upload complete!')
    } catch (error: any) {
      console.error('10. ERROR caught:', error.message, error)
      setError(error.message || 'Failed to upload image')
    } finally {
      console.log('11. FINALLY: Setting uploading to false')
      setUploading(false)
      console.log('=== END UPLOAD ===')
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    await uploadFile(file)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {value ? (
        <div className="relative aspect-video w-full max-w-md border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            sizes="(max-width: 768px) 100vw, 448px"
            className="object-cover"
            unoptimized={value.includes('cloudinary.com')}
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <>
                    <svg
                      className="w-8 h-8 text-gray-400 animate-spin mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-8 h-8 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-700">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                  </>
                )}
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
