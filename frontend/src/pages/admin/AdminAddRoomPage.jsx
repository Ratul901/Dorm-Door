import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import AdminLayout from '../../components/dashboard/AdminLayout'

const initialForm = {
  dorm: '',
  roomNumber: '',
  floor: '',
  type: 'Single Room',
  seatCount: 1,
  occupiedSeats: 0,
  priceMonthly: 0,
  amenities: '',
  images: '',
  status: 'Open',
}

function AdminAddRoomPage() {
  const navigate = useNavigate()
  const [dorms, setDorms] = useState([])
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/dorms').then(({ data }) => setDorms(data.dorms)).catch(() => setDorms([]))
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await api.post('/rooms', {
        ...form,
        seatCount: Number(form.seatCount),
        occupiedSeats: Number(form.occupiedSeats),
        priceMonthly: Number(form.priceMonthly),
        amenities: form.amenities
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        images: form.images
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })

      navigate('/admin/availability')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create room')
    }
  }

  return (
    <AdminLayout>
      <h1>Add Room</h1>
      <section className="card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Dorm
              <select name="dorm" value={form.dorm} onChange={handleChange} required>
                <option value="">Select dorm</option>
                {dorms.map((dorm) => (
                  <option key={dorm._id} value={dorm._id}>{dorm.name}</option>
                ))}
              </select>
            </label>

            <label>
              Room Number
              <input name="roomNumber" value={form.roomNumber} onChange={handleChange} required />
            </label>

            <label>
              Floor
              <input name="floor" value={form.floor} onChange={handleChange} />
            </label>

            <label>
              Type
              <select name="type" value={form.type} onChange={handleChange}>
                <option>Single Room</option>
                <option>Double Room</option>
                <option>Shared (4 Bed)</option>
                <option>Studio Suite</option>
                <option>Premium Studio</option>
              </select>
            </label>

            <label>
              Seat Count
              <input name="seatCount" type="number" value={form.seatCount} onChange={handleChange} min="1" />
            </label>

            <label>
              Occupied Seats
              <input name="occupiedSeats" type="number" value={form.occupiedSeats} onChange={handleChange} min="0" />
            </label>

            <label>
              Monthly Price (BDT)
              <input name="priceMonthly" type="number" value={form.priceMonthly} onChange={handleChange} min="0" />
            </label>

            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Open</option>
                <option>Limited</option>
                <option>Full</option>
                <option>Maintenance</option>
              </select>
            </label>

            <label>
              Amenities (comma separated)
              <input name="amenities" value={form.amenities} onChange={handleChange} />
            </label>

            <label>
              Image URLs (comma separated)
              <textarea name="images" value={form.images} onChange={handleChange} rows={3} />
            </label>
          </div>

          <button type="submit" className="btn btn-primary">Create Room</button>
          {message ? <p className="form-error">{message}</p> : null}
        </form>
      </section>
    </AdminLayout>
  )
}

export default AdminAddRoomPage
