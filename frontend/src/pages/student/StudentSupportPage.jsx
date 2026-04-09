import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'
import StudentLayout from '../../components/dashboard/StudentLayout'

const initialTicket = {
  subject: '',
  description: '',
  priority: 'Medium',
}

function StudentSupportPage() {
  const [tickets, setTickets] = useState([])
  const [ticketForm, setTicketForm] = useState(initialTicket)
  const [activeTicketId, setActiveTicketId] = useState('')
  const [reply, setReply] = useState('')
  const [message, setMessage] = useState('')

  const fetchTickets = () => {
    api.get('/support').then(({ data }) => setTickets(data.tickets)).catch(() => setTickets([]))
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const activeTicket = useMemo(
    () => tickets.find((ticket) => ticket._id === activeTicketId) || tickets[0],
    [tickets, activeTicketId],
  )

  const handleTicketChange = (event) => {
    const { name, value } = event.target
    setTicketForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateTicket = async (event) => {
    event.preventDefault()

    try {
      await api.post('/support', ticketForm)
      setMessage('Support ticket created')
      setTicketForm(initialTicket)
      fetchTickets()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create support ticket')
    }
  }

  const handleSendReply = async (event) => {
    event.preventDefault()

    if (!activeTicket?._id || !reply.trim()) {
      return
    }

    try {
      await api.post(`/support/${activeTicket._id}/messages`, { text: reply })
      setReply('')
      fetchTickets()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send message')
    }
  }

  return (
    <StudentLayout>
      <h1>Support Center</h1>

      <section className="card">
        <h2>Create Ticket</h2>
        <form className="form" onSubmit={handleCreateTicket}>
          <label>
            Subject
            <input name="subject" value={ticketForm.subject} onChange={handleTicketChange} required />
          </label>

          <label>
            Description
            <textarea name="description" value={ticketForm.description} onChange={handleTicketChange} rows={3} required />
          </label>

          <label>
            Priority
            <select name="priority" value={ticketForm.priority} onChange={handleTicketChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </label>

          <button className="btn btn-primary" type="submit">Open Ticket</button>
          {message ? <p className="form-message">{message}</p> : null}
        </form>
      </section>

      <section className="card">
        <h2>My Tickets</h2>

        <div className="split-grid">
          <div>
            <ul className="list-clean selectable-list">
              {tickets.map((ticket) => (
                <li key={ticket._id}>
                  <button
                    type="button"
                    className={ticket._id === activeTicket?._id ? 'active' : ''}
                    onClick={() => setActiveTicketId(ticket._id)}
                  >
                    <strong>{ticket.subject}</strong>
                    <p>{ticket.status} | {ticket.priority}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {activeTicket ? (
              <>
                <h3>{activeTicket.subject}</h3>
                <p>{activeTicket.description}</p>
                <p>
                  Status: <strong>{activeTicket.status}</strong> | Priority: <strong>{activeTicket.priority}</strong>
                </p>

                <h4>Messages</h4>
                <ul className="list-clean">
                  {activeTicket.messages?.map((item, index) => (
                    <li key={`${item.createdAt}-${index}`}>
                      <p>{item.sender?.name || 'Unknown'}: {item.text}</p>
                      <small>{new Date(item.createdAt).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleSendReply} className="form">
                  <label>
                    Reply
                    <textarea value={reply} onChange={(event) => setReply(event.target.value)} rows={3} />
                  </label>
                  <button className="btn btn-outline" type="submit">Send</button>
                </form>
              </>
            ) : (
              <p>Select a ticket to view details.</p>
            )}
          </div>
        </div>
      </section>
    </StudentLayout>
  )
}

export default StudentSupportPage
