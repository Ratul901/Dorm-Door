import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
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

function normalizeDormName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/\s+/g, ' ')
}

function toDateInputValue(value) {
  const parsed = value ? new Date(value) : new Date()
  if (Number.isNaN(parsed.getTime())) return ''
  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function normalizeGender(value) {
  const normalized = String(value || '').trim().toLowerCase()
  if (normalized === 'male') return 'Male'
  if (normalized === 'female') return 'Female'
  return 'Prefer not to say'
}

function ApplyNowPage() {
  const { isAuthenticated, token, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const prefilledDormRef = useRef(false)
  const profilePrefilledRef = useRef(false)

  const [form, setForm] = useState(initialForm)
  const [dorms, setDorms] = useState([])
  const [rooms, setRooms] = useState([])
  const [message, setMessage] = useState('')
  const [prefillMessage, setPrefillMessage] = useState('')
  const todayDateValue = useMemo(() => toDateInputValue(), [])

  const isDemoUser = token === 'dormdoor_demo_token'

  const requestedDormId = searchParams.get('dormId') || ''
  const requestedDormName = searchParams.get('dormName') || ''

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
    if (!isAuthenticated || profilePrefilledRef.current) return

    let mounted = true

    const hydrateProfile = (profileUser = {}) => {
      if (!mounted) return
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || profileUser.name || '',
        email: prev.email || profileUser.email || '',
        phone: prev.phone || profileUser.phone || '',
        studentId: prev.studentId || profileUser.studentId || '',
        department: prev.department || profileUser.department || '',
        university: prev.university || profileUser.university || '',
        gender: prev.gender || normalizeGender(profileUser.gender),
        address: prev.address || profileUser.address || '',
        emergencyName: prev.emergencyName || profileUser.emergencyContact?.name || '',
        emergencyRelation: prev.emergencyRelation || profileUser.emergencyContact?.relation || '',
        emergencyPhone: prev.emergencyPhone || profileUser.emergencyContact?.phone || '',
      }))
    }

    async function prefillProfile() {
      if (isDemoUser) {
        hydrateProfile(user || {})
        profilePrefilledRef.current = true
        return
      }

      try {
        const { data } = await api.get('/profile')
        hydrateProfile(data.user || user || {})
      } catch {
        hydrateProfile(user || {})
      } finally {
        profilePrefilledRef.current = true
      }
    }

    prefillProfile()

    return () => {
      mounted = false
    }
  }, [isAuthenticated, isDemoUser, user])

  useEffect(() => {
    if (prefilledDormRef.current || dorms.length === 0) {
      return
    }

    let matchedDorm = null
    if (requestedDormId) {
      matchedDorm = dorms.find((dorm) => dorm._id === requestedDormId) || null
    }

    if (!matchedDorm && requestedDormName) {
      const requestedNormalized = normalizeDormName(requestedDormName)
      matchedDorm =
        dorms.find((dorm) => normalizeDormName(dorm.name) === requestedNormalized) ||
        dorms.find((dorm) => normalizeDormName(dorm.name).includes(requestedNormalized)) ||
        dorms.find((dorm) => requestedNormalized.includes(normalizeDormName(dorm.name))) ||
        null
    }

    if (matchedDorm) {
      setForm((prev) => ({
        ...prev,
        dorm: prev.dorm || matchedDorm._id,
      }))
      setPrefillMessage(`Dorm preselected: ${matchedDorm.name}`)
    } else if (requestedDormName) {
      setPrefillMessage(`"${requestedDormName}" is not currently available. Please choose another dorm.`)
    }

    prefilledDormRef.current = true
  }, [dorms, requestedDormId, requestedDormName])

  const canSubmit = useMemo(() => {
    return form.dorm && form.fullName && form.email && form.studentId && form.emergencyName && form.emergencyPhone
  }, [form])

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'dorm') {
      setForm((prev) => ({
        ...prev,
        dorm: value,
        room: '',
      }))
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/apply-now${location.search || ''}` } } })
      return
    }

    if (form.moveInDate && form.moveInDate < todayDateValue) {
      setMessage('Move-in date cannot be in the past.')
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
          gender: normalizeGender(form.gender),
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
      setForm((prev) => ({
        ...initialForm,
        fullName: prev.fullName,
        email: prev.email,
        phone: prev.phone,
        studentId: prev.studentId,
        department: prev.department,
        university: prev.university,
        gender: prev.gender,
        address: prev.address,
        emergencyName: prev.emergencyName,
        emergencyRelation: prev.emergencyRelation,
        emergencyPhone: prev.emergencyPhone,
      }))
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to submit application.')
    }
  }

  return (
    <PageLayout>
      <section>
        <h1>Apply Now</h1>
        <p>Submit your dorm application in one place. Student and admin dashboards update instantly.</p>
        {prefillMessage ? <p className="form-message">{prefillMessage}</p> : null}
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
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
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
            <input name="moveInDate" type="date" min={todayDateValue} value={form.moveInDate} onChange={handleChange} />
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
