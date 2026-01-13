'use client'

import { usePathname } from 'next/navigation'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SecretGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isValid, setIsValid] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const secretPath = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'admin'

    // Check if URL starts with secret path
    if (pathname.startsWith(`/${secretPath}`)) {
      setIsValid(true)
    } else if (pathname.startsWith('/admin')) {
      // Block direct /admin access
      setIsValid(false)
    } else {
      setIsValid(true) // Allow other paths
    }

    setIsChecking(false)
  }, [pathname])

  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isValid) {
    notFound()
  }

  return <>{children}</>
}
