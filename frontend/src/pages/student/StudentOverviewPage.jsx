import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import StudentLayout from '../../components/dashboard/StudentLayout'

function StudentOverviewPage() {
  const [overview, setOverview] = useState(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    api
      .get('/dashboard/student')
      .then(({ data }) => setOverview(data.overview))
      .catch(() => setOverview(null))

    api
      .get('/notifications')
      .then(({ data }) => setNotifications(data.notifications.slice(0, 5)))
      .catch(() => setNotifications([]))
  }, [])

  return (
    <StudentLayout>
      <h1>Student Overview</h1>

      <div className="stats-row">
        <div className="stat-box"><span>Applications</span><strong>{overview?.applications ?? 0}</strong></div>
        <div className="stat-box"><span>Documents</span><strong>{overview?.documents ?? 0}</strong></div>
        <div className="stat-box"><span>Maintenance Tickets</span><strong>{overview?.maintenanceTickets ?? 0}</strong></div>
        <div className="stat-box"><span>Support Tickets</span><strong>{overview?.supportTickets ?? 0}</strong></div>
        <div className="stat-box"><span>Unread Notifications</span><strong>{overview?.unreadNotifications ?? 0}</strong></div>
      </div>

      <section className="card">
        <h2>Recent Applications</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dorm</th>
                <th>Room</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {overview?.recentApplications?.map((item) => (
                <tr key={item._id}>
                  <td>{item.dorm?.name || '-'}</td>
                  <td>{item.room?.roomNumber || 'Auto'}</td>
                  <td>{item.status}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Latest Notifications</h2>
        <ul className="list-clean">
          {notifications.map((notification) => (
            <li key={notification._id}>
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
            </li>
          ))}
        </ul>
      </section>
    </StudentLayout>
  )
}

export default StudentOverviewPage
