import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import PageLayout from '../../components/layout/PageLayout'
import { useAuth } from '../../context/AuthContext'

const initialForm = {
  dorm: '',
  room: '',
  fullName: '',
  email: '',
  phone: '',
  studentId: '',
  department: '',
  university: '',
  gender: '',
  address: '',
  preferredRoomType: '',
  blockPreference: '',
  moveInDate: '',
  specialRequests: '',
  emergencyName: '',
  emergencyRelation: '',
  emergencyPhone: '',
}

function ApplyNowPage() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [dorms, setDorms] = useState([])
  const [rooms, setRooms] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
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

  useEffect(() => {
    if (user && isAuthenticated) {
      setForm((prev) => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        studentId: user.studentId || '',
        department: user.department || '',
        university: user.university || '',
        address: user.address || '',
      }))
    }
  }, [user, isAuthenticated])

  const canSubmit = useMemo(() => {
    return form.dorm && form.fullName && form.email && form.studentId && form.emergencyName && form.emergencyPhone
  }, [form])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/apply-now' } } })
      return
    }

    try {
      await api.post('/applications', {
        dorm: form.dorm,
        room: form.room || undefined,
        personalInfo: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          studentId: form.studentId,
          department: form.department,
          university: form.university,
          gender: form.gender,
          address: form.address,
        },
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

      setMessage('Application submitted successfully.')
      setForm(initialForm)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to submit application.')
    }
  }

  return (
    <PageLayout>
      <section>
        <h1>Apply Now</h1>
        <p>Submit your dorm application in one place. Student and admin dashboards update instantly.</p>
      </section>

      <form className="form" onSubmit={handleSubmit}>
        <h2>Room Selection</h2>
        <div className="form-grid">
          <label>
            Dorm
            <select name="dorm" value={form.dorm} onChange={handleChange} required>
              <option value="">Select dorm</option>
              {dorms.map((dorm) => (
                <option key={dorm._id} value={dorm._id}>
                  {dorm.name} ({dorm.block})
                </option>
              ))}
            </select>
          </label>

          <label>
            Room (optional)
            <select name="room" value={form.room} onChange={handleChange}>
              <option value="">Auto-assign based on availability</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.roomNumber} - {room.type} - BDT {room.priceMonthly}
                </option>
              ))}
            </select>
          </label>
        </div>

        <h2>Personal Information</h2>
        <div className="form-grid">
          <label>
            Full Name
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Student ID
            <input name="studentId" value={form.studentId} onChange={handleChange} required />
          </label>
          <label>
            Department
            <input name="department" value={form.department} onChange={handleChange} />
          </label>
          <label>
            University
            <input name="university" value={form.university} onChange={handleChange} />
          </label>
          <label>
            Gender
            <input name="gender" value={form.gender} onChange={handleChange} />
          </label>
          <label>
            Address
            <input name="address" value={form.address} onChange={handleChange} />
          </label>
        </div>

        <h2>Preferences</h2>
        <div className="form-grid">
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
            Special Requests
            <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} rows={3} />
          </label>
        </div>

        <h2>Emergency Contact</h2>
        <div className="form-grid">
          <label>
            Name
            <input name="emergencyName" value={form.emergencyName} onChange={handleChange} required />
          </label>
          <label>
            Relation
            <input name="emergencyRelation" value={form.emergencyRelation} onChange={handleChange} />
          </label>
          <label>
            Phone
            <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} required />
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
          Submit Application
        </button>

        {message ? <p className="form-message">{message}</p> : null}
      </form>
    </PageLayout>
  )
}

export default ApplyNowPage
