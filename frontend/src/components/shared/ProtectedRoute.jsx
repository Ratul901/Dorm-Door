import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children, roles = [] }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="centered-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    const loginPath = location.pathname.startsWith('/super-admin') ? '/super-admin/login' : '/login'
    return <Navigate to={loginPath} replace state={{ from: location }} />
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    const target = user.role === 'superAdmin' ? '/super-admin/dashboard' : user.role === 'admin' ? '/admin' : '/student'
    return <Navigate to={target} replace />
  }

  return children
}

export default ProtectedRoute
