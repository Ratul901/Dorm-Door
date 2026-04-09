import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'
import StudentLayout from '../../components/dashboard/StudentLayout'

const initialForm = {
  dorm: '',
  room: '',
  preferredRoomType: '',
  blockPreference: '',
  moveInDate: '',
  specialRequests: '',
  emergencyName: '',
  emergencyRelation: '',
  emergencyPhone: '',
}

function StudentApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [dorms, setDorms] = useState([])
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  const fetchApplications = () => {
    api.get('/applications').then(({ data }) => setApplications(data.applications)).catch(() => setApplications([]))
  }

  useEffect(() => {
    fetchApplications()
    api.get('/dorms').then(({ data }) => setDorms(data.dorms)).catch(() => setDorms([]))
  }, [])

  useEffect(() => {
    if (!form.dorm) {
      setRooms([])
      return
    }

    api
      .get('/rooms', { params: { dormId: form.dorm } })
      .then(({ data }) => setRooms(data.rooms.filter((room) => room.status !== 'Full' && room.status !== 'Maintenance')))
      .catch(() => setRooms([]))
  }, [form.dorm])

  const pendingCount = useMemo(
    () => applications.filter((item) => ['Pending', 'Under Review'].includes(item.status)).length,
    [applications],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await api.post('/applications', {
        dorm: form.dorm,
        room: form.room || undefined,
        preferences: {
          preferredRoomType: form.preferredRoomType,
          blockPreference: form.blockPreference,
          moveInDate: form.moveInDate || undefined,
          specialRequests: form.specialRequests,
        },
        emergencyContact: {
          name: form.emergencyName,
          relation: form.emergencyRelation,
          phone: form.emergencyPhone,
        },
      })

      setMessage('Application created')
      setForm(initialForm)
      fetchApplications()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create application')
    }
  }

  return (
    <StudentLayout>
      <h1>Room Applications</h1>

      <div className="stats-row">
        <div className="stat-box"><span>Total</span><strong>{applications.length}</strong></div>
        <div className="stat-box"><span>Pending/Review</span><strong>{pendingCount}</strong></div>
      </div>

      <section className="card">
        <h2>Create New Application</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Dorm
              <select name="dorm" value={form.dorm} onChange={handleChange} required>
                <option value="">Select</option>
                {dorms.map((dorm) => (
                  <option key={dorm._id} value={dorm._id}>{dorm.name}</option>
                ))}
              </select>
            </label>

            <label>
              Room
              <select name="room" value={form.room} onChange={handleChange}>
                <option value="">Auto-assign</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>{room.roomNumber} ({room.type})</option>
                ))}
              </select>
            </label>

            <label>
              Preferred Room Type
              <input name="preferredRoomType" value={form.preferredRoomType} onChange={handleChange} />
            </label>

            <label>
              Block Preference
              <input name="blockPreference" value={form.blockPreference} onChange={handleChange} />
            </label>

            <label>
              Move-in Date
              <input name="moveInDate" type="date" value={form.moveInDate} onChange={handleChange} />
            </label>

            <label>
              Emergency Contact Name
              <input name="emergencyName" value={form.emergencyName} onChange={handleChange} required />
            </label>

            <label>
              Emergency Relation
              <input name="emergencyRelation" value={form.emergencyRelation} onChange={handleChange} />
            </label>

            <label>
              Emergency Phone
              <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} required />
            </label>

            <label>
              Special Requests
              <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} rows={3} />
            </label>
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
          {message ? <p className="form-message">{message}</p> : null}
        </form>
      </section>

      <section className="card">
        <h2>My Applications</h2>
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
              {applications.map((item) => (
                <tr key={item._id}>
                  <td>{item.dorm?.name || '-'}</td>
                  <td>{item.room?.roomNumber || 'Auto'}</td>
                  <td>{item.status}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </StudentLayout>
  )
}

export default StudentApplicationsPage
