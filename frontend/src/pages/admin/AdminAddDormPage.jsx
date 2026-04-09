import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import AdminLayout from '../../components/dashboard/AdminLayout'

const initialForm = {
  name: '',
  block: '',
  address: '',
  description: '',
  rules: '',
  facilities: '',
  images: '',
  totalFloors: 1,
  totalCapacity: 0,
}

function AdminAddDormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await api.post('/dorms', {
        ...form,
        totalFloors: Number(form.totalFloors),
        totalCapacity: Number(form.totalCapacity),
        facilities: form.facilities
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        images: form.images
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      })

      navigate('/admin/dorms')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create dorm')
    }
  }

  return (
    <AdminLayout>
      <h1>Add Dorm</h1>
      <section className="card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>
              Block
              <input name="block" value={form.block} onChange={handleChange} required />
            </label>

            <label>
              Address
              <input name="address" value={form.address} onChange={handleChange} required />
            </label>

            <label>
              Total Floors
              <input name="totalFloors" type="number" value={form.totalFloors} onChange={handleChange} min="1" />
            </label>

            <label>
              Total Capacity
              <input name="totalCapacity" type="number" value={form.totalCapacity} onChange={handleChange} min="0" />
            </label>

            <label>
              Facilities (comma separated)
              <input name="facilities" value={form.facilities} onChange={handleChange} />
            </label>

            <label>
              Image URLs (comma separated)
              <textarea name="images" value={form.images} onChange={handleChange} rows={3} />
            </label>

            <label>
              Description
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
            </label>

            <label>
              Rules
              <textarea name="rules" value={form.rules} onChange={handleChange} rows={4} />
            </label>
          </div>

          <button type="submit" className="btn btn-primary">Create Dorm</button>
          {message ? <p className="form-error">{message}</p> : null}
        </form>
      </section>
    </AdminLayout>
  )
}

export default AdminAddDormPage
