import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import AdminLayout from '../../components/dashboard/AdminLayout'

function AdminAvailabilityPage() {
  const [rooms, setRooms] = useState([])
  const [message, setMessage] = useState('')

  const fetchRooms = () => {
    api.get('/rooms').then(({ data }) => setRooms(data.rooms)).catch(() => setRooms([]))
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const updateRoom = async (roomId, payload) => {
    try {
      await api.patch(`/rooms/${roomId}`, payload)
      setMessage('Room updated')
      fetchRooms()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update room')
    }
  }

  return (
    <AdminLayout>
      <h1>Availability</h1>
      {message ? <p className="form-message">{message}</p> : null}

      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dorm</th>
                <th>Room</th>
                <th>Type</th>
                <th>Seats</th>
                <th>Occupied</th>
                <th>Status</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.dorm?.name || '-'}</td>
                  <td>{room.roomNumber}</td>
                  <td>{room.type}</td>
                  <td>{room.seatCount}</td>
                  <td>{room.occupiedSeats}</td>
                  <td>{room.status}</td>
                  <td>
                    <div className="inline-actions">
                      <button type="button" className="btn btn-outline" onClick={() => updateRoom(room._id, { occupiedSeats: Math.max(room.occupiedSeats - 1, 0) })}>- Occupied</button>
                      <button type="button" className="btn btn-outline" onClick={() => updateRoom(room._id, { occupiedSeats: room.occupiedSeats + 1 })}>+ Occupied</button>
                      <button type="button" className="btn btn-danger" onClick={() => updateRoom(room._id, { status: 'Maintenance' })}>Maintenance</button>
                      <button type="button" className="btn btn-primary" onClick={() => updateRoom(room._id, { status: 'Open' })}>Open</button>
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

export default AdminAvailabilityPage
