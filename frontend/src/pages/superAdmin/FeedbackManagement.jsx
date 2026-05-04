import { useEffect, useMemo, useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import DataTable from '../../components/superAdmin/DataTable'
import SimpleModal from '../../components/superAdmin/SimpleModal'
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout'
import { deleteFeedback, getFeedback } from '../../services/superAdminApi'
import { formatDate, formatDateTime } from './pageUtils'

function FeedbackManagement() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  const loadFeedback = async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await getFeedback()
      setFeedback(data.feedback || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load feedback')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeedback()
  }, [])

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this feedback?')) return
    try {
      await deleteFeedback(item._id)
      await loadFeedback()
      setMessage('Feedback deleted successfully.')
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Failed to delete feedback.')
    }
  }

  const columns = useMemo(
    () => [
      { key: 'student', label: 'Student Name', render: (row) => row.anonymous ? 'Anonymous' : row.student?.name || 'Unknown Student' },
      { key: 'dorm', label: 'Dorm Name', render: (row) => row.dorm?.name || 'N/A' },
      { key: 'rating', label: 'Rating', render: (row) => `${row.rating?.overall || 0}/5` },
      { key: 'comment', label: 'Comment', render: (row) => <span className="line-clamp-2">{row.comment}</span> },
      { key: 'date', label: 'Date', render: (row) => formatDate(row.createdAt) },
      {
        key: 'actions',
        label: 'Actions',
        render: (row) => (
          <div className="flex gap-2">
            <button type="button" onClick={() => setSelectedFeedback(row)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="View">
              <Eye size={16} />
            </button>
            <button type="button" onClick={() => handleDelete(row)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <SuperAdminLayout title="Feedback" subtitle="Read student feedback and remove inappropriate reviews.">
      {error ? <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {message ? <p className="mb-5 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">{message}</p> : null}

      <DataTable columns={columns} rows={feedback} loading={loading} emptyMessage="No feedback found." />

      {selectedFeedback ? (
        <SimpleModal title="Feedback Details" onClose={() => setSelectedFeedback(null)}>
          <div className="space-y-3 text-sm text-slate-700">
            <p><strong>Student:</strong> {selectedFeedback.anonymous ? 'Anonymous' : selectedFeedback.student?.name || 'N/A'}</p>
            <p><strong>Dorm:</strong> {selectedFeedback.dorm?.name || 'N/A'}</p>
            <p><strong>Rating:</strong> {selectedFeedback.rating?.overall || 0}/5</p>
            <p><strong>Comment:</strong> {selectedFeedback.comment}</p>
            <p><strong>Date:</strong> {formatDateTime(selectedFeedback.createdAt)}</p>
          </div>
        </SimpleModal>
      ) : null}
    </SuperAdminLayout>
  )
}

export default FeedbackManagement
