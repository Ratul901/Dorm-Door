import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import AdminLayout from '../../components/dashboard/AdminLayout'

function AdminOverviewPage() {
  const [overview, setOverview] = useState(null)

  useEffect(() => {
    api.get('/dashboard/admin').then(({ data }) => setOverview(data.overview)).catch(() => setOverview(null))
  }, [])

  return (
    <AdminLayout>
      <h1>Admin Overview</h1>

      <div className="stats-row">
        <div className="stat-box"><span>Dorms</span><strong>{overview?.dorms ?? 0}</strong></div>
        <div className="stat-box"><span>Rooms</span><strong>{overview?.rooms ?? 0}</strong></div>
        <div className="stat-box"><span>Applications</span><strong>{overview?.applications ?? 0}</strong></div>
        <div className="stat-box"><span>Pending Applications</span><strong>{overview?.pendingApplications ?? 0}</strong></div>
        <div className="stat-box"><span>Support Open</span><strong>{overview?.supportOpen ?? 0}</strong></div>
        <div className="stat-box"><span>Maintenance Open</span><strong>{overview?.maintenanceOpen ?? 0}</strong></div>
        <div className="stat-box"><span>Occupancy Rate</span><strong>{overview?.occupancyRate ?? 0}%</strong></div>
      </div>

      <section className="card">
        <h2>Recent Applications</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Dorm</th>
                <th>Room</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {overview?.recentApplications?.map((app) => (
                <tr key={app._id}>
                  <td>{app.student?.name || '-'}</td>
                  <td>{app.dorm?.name || '-'}</td>
                  <td>{app.room?.roomNumber || 'Auto'}</td>
                  <td>{app.status}</td>
                  <td>{new Date(app.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  )
}

export default AdminOverviewPage
