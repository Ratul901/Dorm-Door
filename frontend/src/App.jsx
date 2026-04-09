import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/shared/ProtectedRoute'
import HomePage from './pages/public/HomePage'
import BrowseDormsPage from './pages/public/BrowseDormsPage'
import DormDetailsPage from './pages/public/DormDetailsPage'
import ApplyNowPage from './pages/public/ApplyNowPage'
import LoginPage from './pages/public/LoginPage'
import SignupPage from './pages/public/SignupPage'
import StudentPortal from './features/student/StudentPortal'
import AdminPortal from './features/admin/AdminPortal'

function NotFound() {
  return (
    <div className="centered-screen">
      <div>
        <h1>404</h1>
        <p>Page not found.</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/browse-dorms" element={<BrowseDormsPage />} />
      <Route path="/dorms/:id" element={<DormDetailsPage />} />
      <Route path="/apply-now" element={<ApplyNowPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/student/*"
        element={
          <ProtectedRoute roles={['student', 'admin']}>
            <StudentPortal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminPortal />
          </ProtectedRoute>
        }
      />

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
