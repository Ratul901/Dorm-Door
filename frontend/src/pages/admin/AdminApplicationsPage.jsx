import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import AdminLayout from '../../components/dashboard/AdminLayout'

function AdminApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [message, setMessage] = useState('')

  const fetchApplications = () => {
    api.get('/applications').then(({ data }) => setApplications(data.applications)).catch(() => setApplications([]))
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleStatusChange = async (applicationId, status) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, { status })
      setMessage('Application status updated')
      fetchApplications()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <AdminLayout>
      <h1>Applications</h1>
      {message ? <p className="form-message">{message}</p> : null}

      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Dorm</th>
                <th>Room</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((item) => (
                <tr key={item._id}>
                  <td>{item.student?.name}</td>
                  <td>{item.dorm?.name}</td>
                  <td>{item.room?.roomNumber || 'Auto'}</td>
                  <td>{item.status}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="inline-actions">
                      <button type="button" className="btn btn-outline" onClick={() => handleStatusChange(item._id, 'Under Review')}>Review</button>
                      <button type="button" className="btn btn-primary" onClick={() => handleStatusChange(item._id, 'Approved')}>Approve</button>
                      <button type="button" className="btn btn-danger" onClick={() => handleStatusChange(item._id, 'Rejected')}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  )
}

export default AdminApplicationsPage
