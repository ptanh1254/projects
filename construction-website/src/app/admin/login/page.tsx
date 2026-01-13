import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import LoginForm from '@/components/admin/LoginForm'

export const metadata = {
  title: 'Admin Login - Construction Co.',
  description: 'Login to admin dashboard',
}

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  // Redirect to dashboard if already logged in
  if (session) {
    redirect('/admin/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-4">
            <span className="text-blue-600 font-bold text-2xl">C</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-100">Sign in to access admin panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 text-sm mt-6">
          Construction Co. Admin Panel &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
