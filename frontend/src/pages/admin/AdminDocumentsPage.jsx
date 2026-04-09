import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import AdminLayout from '../../components/dashboard/AdminLayout'

function AdminDocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [message, setMessage] = useState('')

  const fetchDocuments = () => {
    api.get('/documents').then(({ data }) => setDocuments(data.documents)).catch(() => setDocuments([]))
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleReview = async (id, status) => {
    try {
      await api.patch(`/documents/${id}/review`, { status })
      setMessage('Document status updated')
      fetchDocuments()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update document')
    }
  }

  return (
    <AdminLayout>
      <h1>Documents</h1>
      {message ? <p className="form-message">{message}</p> : null}

      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Category</th>
                <th>File Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td>{doc.student?.name || '-'}</td>
                  <td>{doc.category}</td>
                  <td>
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer">{doc.fileName}</a>
                  </td>
                  <td>{doc.status}</td>
                  <td>
                    <div className="inline-actions">
                      <button type="button" className="btn btn-primary" onClick={() => handleReview(doc._id, 'Verified')}>Verify</button>
                      <button type="button" className="btn btn-danger" onClick={() => handleReview(doc._id, 'Needs Update')}>Need Update</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  )
}

export default AdminDocumentsPage
