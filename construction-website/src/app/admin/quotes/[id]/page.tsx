'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/admin/StatusBadge'
import { formatDate } from '@/lib/utils'

interface Quote {
  id: string
  name: string
  email: string
  phone: string
  projectType: string
  location: string
  area: number | null
  budget: string | null
  timeline: string | null
  message: string | null
  fileUrl: string | null
  status: string
  adminNote: string | null
  createdAt: string
}

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [adminNote, setAdminNote] = useState('')

  useEffect(() => {
    fetchQuote()
  }, [params.id])

  const fetchQuote = async () => {
    try {
      const res = await fetch(`/api/admin/quotes/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setQuote(data)
        setAdminNote(data.adminNote || '')

        // Mark as viewed if status is new
        if (data.status === 'new') {
          await fetch(`/api/admin/quotes/${params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'viewed' }),
          })
        }
      }
    } catch (error) {
      console.error('Error fetching quote:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNote = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/quotes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNote }),
      })

      if (res.ok) {
        alert('Note saved successfully')
      }
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateStatus = async (status: string) => {
    try {
      const res = await fetch(`/api/admin/quotes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        setQuote(quote ? { ...quote, status } : null)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Quote not found</p>
        <Link href="/admin/quotes" className="text-blue-600 hover:text-blue-700 mt-4">
          Back to Quotes
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <Link href="/admin/quotes" className="hover:text-gray-900">
            Quotes
          </Link>
          <span>/</span>
          <span>Quote Details</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Quote Request Details</h1>
          <StatusBadge status={quote.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a href={`mailto:${quote.email}`} className="text-blue-600 hover:text-blue-700">
                    {quote.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a href={`tel:${quote.phone}`} className="text-blue-600 hover:text-blue-700">
                    {quote.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Project Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{quote.projectType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.location}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Area</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {quote.area ? `${quote.area} sq ft` : 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Budget</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.budget || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Timeline</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.timeline || 'Not specified'}</dd>
              </div>
            </dl>

            {quote.message && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <dt className="text-sm font-medium text-gray-500 mb-2">Message</dt>
                <dd className="text-sm text-gray-900 whitespace-pre-wrap">{quote.message}</dd>
              </div>
            )}

            {quote.fileUrl && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <dt className="text-sm font-medium text-gray-500 mb-2">Attachment</dt>
                <a
                  href={quote.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View attached file
                </a>
              </div>
            )}
          </div>

          {/* Admin Note */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Note</h2>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add internal notes about this quote..."
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveNote}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <select
              value={quote.status}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="new">New</option>
              <option value="viewed">Viewed</option>
              <option value="processed">Processed</option>
            </select>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Submitted</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(quote.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Quote ID</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono text-xs">{quote.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
