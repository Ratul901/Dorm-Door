import { Navigate, Route, Routes } from 'react-router-dom'
import OverviewPage from './pages/OverviewPage'
import DormsPage from './pages/DormsPage'
import ApplicationsPage from './pages/ApplicationsPage'
import DocumentsPage from './pages/DocumentsPage'
import AvailabilityPage from './pages/AvailabilityPage'
import SupportPage from './pages/SupportPage'
import SettingsPage from './pages/SettingsPage'
import AddRoomPage from './pages/AddRoomPage'
import AddDormPage from './pages/AddDormPage'

function AdminPortal() {
  return (
    <Routes>
      <Route path="/admin" element={<OverviewPage />} />
      <Route path="/admin/dorms" element={<DormsPage />} />
      <Route path="/admin/dorms/add" element={<AddDormPage />} />
      <Route path="/admin/rooms/add" element={<AddRoomPage />} />
      <Route path="/admin/applications" element={<ApplicationsPage />} />
      <Route path="/admin/documents" element={<DocumentsPage />} />
      <Route path="/admin/availability" element={<AvailabilityPage />} />
      <Route path="/admin/support" element={<SupportPage />} />
      <Route path="/admin/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export default AdminPortal



