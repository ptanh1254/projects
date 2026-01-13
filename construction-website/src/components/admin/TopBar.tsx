'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function TopBar() {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page title will be added by each page */}
        <div className="flex-1"></div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* View site link */}
          <Link
            href="/"
            target="_blank"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span>View Site</span>
          </Link>

          {/* User info */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{session?.user?.name}</div>
              <div className="text-xs text-gray-500">{session?.user?.email}</div>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
