import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import StudentLayout from '../../components/dashboard/StudentLayout'

const initialForm = {
  title: '',
  description: '',
  priority: 'Medium',
}

function StudentMaintenancePage() {
  const [tickets, setTickets] = useState([])
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  const fetchTickets = () => {
    api.get('/maintenance').then(({ data }) => setTickets(data.tickets)).catch(() => setTickets([]))
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await api.post('/maintenance', form)
      setMessage('Maintenance request created')
      setForm(initialForm)
      fetchTickets()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create ticket')
    }
  }

  return (
    <StudentLayout>
      <h1>Maintenance</h1>

      <section className="card">
        <h2>Report Issue</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} required />
          </label>

          <label>
            Priority
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </label>

          <button type="submit" className="btn btn-primary">Create Ticket</button>
          {message ? <p className="form-message">{message}</p> : null}
        </form>
      </section>

      <section className="card">
        <h2>My Tickets</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.status}</td>
                  <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </StudentLayout>
  )
}

export default StudentMaintenancePage
