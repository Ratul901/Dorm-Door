import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Eye, MessageSquareReply } from 'lucide-react'
import DataTable from '../../components/superAdmin/DataTable'
import SimpleModal from '../../components/superAdmin/SimpleModal'
import StatusBadge from '../../components/superAdmin/StatusBadge'
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout'
import { getComplaints, replyComplaint, solveComplaint } from '../../services/superAdminApi'
import { formatDate, formatDateTime } from './pageUtils'

function statusLabel(status) {
  if (status === 'Resolved') return 'Solved'
  return status || 'Open'
}

function ComplaintManagement() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  const loadComplaints = async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await getComplaints()
      setComplaints(data.complaints || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  const handleReply = async (complaint) => {
    const reply = window.prompt('Write reply:')
    if (!reply) return

    try {
      await replyComplaint(complaint._id, reply)
      await loadComplaints()
      setMessage('Reply sent successfully.')
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Failed to send reply.')
    }
  }

  const handleSolve = async (complaint) => {
    try {
      await solveComplaint(complaint._id)
      await loadComplaints()
      setMessage('Complaint marked as solved.')
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Failed to solve complaint.')
    }
  }

  const columns = useMemo(
    () => [
      { key: 'student', label: 'Student Name', render: (row) => row.student?.name || 'Unknown Student' },
      { key: 'subject', label: 'Subject' },
      { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
      { key: 'status', label: 'Status', render: (row) => <StatusBadge status={statusLabel(row.status)} /> },
      {
        key: 'actions',
        label: 'Actions',
        render: (row) => (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setSelectedComplaint(row)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="View">
              <Eye size={16} />
            </button>
            <button type="button" onClick={() => handleReply(row)} className="rounded-lg p-2 text-primary hover:bg-blue-50" title="Reply">
              <MessageSquareReply size={16} />
            </button>
            <button type="button" onClick={() => handleSolve(row)} className="rounded-lg p-2 text-emerald-700 hover:bg-emerald-50" title="Mark solved">
              <CheckCircle2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <SuperAdminLayout title="Complaints" subtitle="Reply to support tickets and mark complaints as solved.">
      {error ? <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {message ? <p className="mb-5 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">{message}</p> : null}

      <DataTable columns={columns} rows={complaints} loading={loading} emptyMessage="No complaints found." />

      {selectedComplaint ? (
        <SimpleModal title="Complaint Details" onClose={() => setSelectedComplaint(null)}>
          <div className="space-y-4 text-sm text-slate-700">
            <p><strong>Student:</strong> {selectedComplaint.student?.name || 'N/A'}</p>
            <p><strong>Subject:</strong> {selectedComplaint.subject}</p>
            <p><strong>Message:</strong> {selectedComplaint.description}</p>
            <p><strong>Status:</strong> {statusLabel(selectedComplaint.status)}</p>
            <p><strong>Created:</strong> {formatDateTime(selectedComplaint.createdAt)}</p>
            <div>
              <strong>Conversation:</strong>
              <div className="mt-2 space-y-2">
                {(selectedComplaint.messages || []).map((item, index) => (
                  <div key={`${item.createdAt || index}-${index}`} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase text-slate-500">{item.sender?.name || 'User'}</p>
                    <p className="mt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SimpleModal>
      ) : null}
    </SuperAdminLayout>
  )
}

export default ComplaintManagement
