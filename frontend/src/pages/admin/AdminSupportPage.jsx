import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'
import AdminLayout from '../../components/dashboard/AdminLayout'

function AdminSupportPage() {
  const [tickets, setTickets] = useState([])
  const [activeId, setActiveId] = useState('')
  const [reply, setReply] = useState('')
  const [message, setMessage] = useState('')

  const fetchTickets = () => {
    api.get('/support').then(({ data }) => setTickets(data.tickets)).catch(() => setTickets([]))
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const activeTicket = useMemo(
    () => tickets.find((item) => item._id === activeId) || tickets[0],
    [tickets, activeId],
  )

  const handleStatus = async (status) => {
    if (!activeTicket?._id) return

    try {
      await api.patch(`/support/${activeTicket._id}`, { status })
      setMessage('Ticket updated')
      fetchTickets()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update ticket')
    }
  }

  const handleReply = async (event) => {
    event.preventDefault()

    if (!activeTicket?._id || !reply.trim()) return

    try {
      await api.post(`/support/${activeTicket._id}/messages`, { text: reply })
      setReply('')
      fetchTickets()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send reply')
    }
  }

  return (
    <AdminLayout>
      <h1>Support</h1>
      {message ? <p className="form-message">{message}</p> : null}

      <section className="card">
        <div className="split-grid">
          <div>
            <ul className="list-clean selectable-list">
              {tickets.map((ticket) => (
                <li key={ticket._id}>
                  <button
                    type="button"
                    className={ticket._id === activeTicket?._id ? 'active' : ''}
                    onClick={() => setActiveId(ticket._id)}
                  >
                    <strong>{ticket.subject}</strong>
                    <p>{ticket.student?.name} | {ticket.status}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {activeTicket ? (
              <>
                <h2>{activeTicket.subject}</h2>
                <p>{activeTicket.description}</p>
                <p>
                  Student: <strong>{activeTicket.student?.name}</strong>
                </p>
                <p>
                  Status: <strong>{activeTicket.status}</strong>
                </p>

                <div className="inline-actions">
                  <button className="btn btn-outline" type="button" onClick={() => handleStatus('Pending')}>Mark Pending</button>
                  <button className="btn btn-primary" type="button" onClick={() => handleStatus('Resolved')}>Mark Resolved</button>
                </div>

                <h3>Messages</h3>
                <ul className="list-clean">
                  {activeTicket.messages?.map((entry, index) => (
                    <li key={`${entry.createdAt}-${index}`}>
                      <p>{entry.sender?.name}: {entry.text}</p>
                      <small>{new Date(entry.createdAt).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>

                <form className="form" onSubmit={handleReply}>
                  <label>
                    Reply
                    <textarea rows={3} value={reply} onChange={(event) => setReply(event.target.value)} />
                  </label>
                  <button className="btn btn-primary" type="submit">Send Reply</button>
                </form>
              </>
            ) : (
              <p>Select a ticket from the left panel.</p>
            )}
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}

export default AdminSupportPage
