import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import StudentLayout from '../../components/dashboard/StudentLayout'

function StudentProfilePage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    department: '',
    university: '',
    address: '',
    emergencyContact: { name: '', relation: '', phone: '' },
    settings: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    api
      .get('/profile')
      .then(({ data }) => {
        const user = data.user
        setForm({
          name: user.name || '',
          phone: user.phone || '',
          department: user.department || '',
          university: user.university || '',
          address: user.address || '',
          emergencyContact: {
            name: user.emergencyContact?.name || '',
            relation: user.emergencyContact?.relation || '',
            phone: user.emergencyContact?.phone || '',
          },
          settings: {
            emailNotifications: user.settings?.emailNotifications ?? true,
            pushNotifications: user.settings?.pushNotifications ?? true,
            smsNotifications: user.settings?.smsNotifications ?? false,
          },
        })
      })
      .catch(() => setMessage('Failed to load profile'))
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    if (name.startsWith('emergency.')) {
      const key = name.replace('emergency.', '')
      setForm((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [key]: value,
        },
      }))
      return
    }

    if (name.startsWith('settings.')) {
      const key = name.replace('settings.', '')
      setForm((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          [key]: type === 'checkbox' ? checked : value,
        },
      }))
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await api.patch('/profile', form)
      setMessage('Profile updated')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed')
    }
  }

  return (
    <StudentLayout>
      <h1>Profile</h1>

      <section className="card">
        <h2>Update Profile</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} />
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
              Address
              <input name="address" value={form.address} onChange={handleChange} />
            </label>

            <label>
              Emergency Name
              <input name="emergency.name" value={form.emergencyContact.name} onChange={handleChange} />
            </label>
            <label>
              Emergency Relation
              <input name="emergency.relation" value={form.emergencyContact.relation} onChange={handleChange} />
            </label>
            <label>
              Emergency Phone
              <input name="emergency.phone" value={form.emergencyContact.phone} onChange={handleChange} />
            </label>

            <label className="checkbox-inline">
              <input
                type="checkbox"
                name="settings.emailNotifications"
                checked={form.settings.emailNotifications}
                onChange={handleChange}
              />
              Email Notifications
            </label>

            <label className="checkbox-inline">
              <input
                type="checkbox"
                name="settings.pushNotifications"
                checked={form.settings.pushNotifications}
                onChange={handleChange}
              />
              Push Notifications
            </label>

            <label className="checkbox-inline">
              <input
                type="checkbox"
                name="settings.smsNotifications"
                checked={form.settings.smsNotifications}
                onChange={handleChange}
              />
              SMS Notifications
            </label>
          </div>

          <button className="btn btn-primary" type="submit">Save Changes</button>
          {message ? <p className="form-message">{message}</p> : null}
        </form>
      </section>
    </StudentLayout>
  )
}

export default StudentProfilePage
