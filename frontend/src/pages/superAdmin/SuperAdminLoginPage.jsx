import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function dashboardPathForRole(role) {
  if (role === 'superAdmin') return '/super-admin/dashboard'
  if (role === 'admin') return '/admin'
  return '/student'
}

function SuperAdminLoginPage() {
  const { login, logout, user, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && user) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const loggedInUser = await login(form)
      if (loggedInUser.role !== 'superAdmin') {
        logout()
        setError('This page is only for super admin accounts.')
        return
      }

      const fromPath = typeof location.state?.from?.pathname === 'string' ? location.state.from.pathname : ''
      const target = fromPath.startsWith('/super-admin') && fromPath !== '/super-admin/login'
        ? fromPath
        : '/super-admin/dashboard'
      navigate(target, { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Super admin login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-slate-900 p-8 text-white md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <ShieldCheck size={25} />
            </div>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-blue-200">Restricted Access</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">Super Admin Login</h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
              This entrance is separate from the public student and dorm admin account flow.
            </p>
          </div>

          <div className="bg-white p-8 text-slate-950 md:p-10">
            <h2 className="text-2xl font-black tracking-tight">Sign in securely</h2>
            <p className="mt-2 text-sm text-slate-500">Use your super admin credentials to continue.</p>

            <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
              <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none focus:border-primary focus:bg-white"
                />
              </label>

              <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Password
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none focus:border-primary focus:bg-white"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-black text-white shadow-soft transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Enter Super Admin Panel'}
              </button>

              {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default SuperAdminLoginPage
