import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import StudentLayout from '../../components/dashboard/StudentLayout'

const initialForm = {
  category: 'Student ID',
  fileName: '',
  fileUrl: '',
}

function StudentDocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  const fetchDocuments = () => {
    api.get('/documents').then(({ data }) => setDocuments(data.documents)).catch(() => setDocuments([]))
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await api.post('/documents', form)
      setMessage('Document metadata uploaded')
      setForm(initialForm)
      fetchDocuments()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed')
    }
  }

  return (
    <StudentLayout>
      <h1>Documents</h1>

      <section className="card">
        <h2>Upload Document Metadata</h2>
        <p>
          Connect your file URL from cloud storage or your own upload API. This project currently stores metadata only.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              <option>Student ID</option>
              <option>Passport Photo</option>
              <option>Admission Certificate</option>
              <option>Health Document</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            File name
            <input name="fileName" value={form.fileName} onChange={handleChange} required />
          </label>

          <label>
            File URL
            <input name="fileUrl" value={form.fileUrl} onChange={handleChange} required />
          </label>

          <button type="submit" className="btn btn-primary">Save Document</button>
          {message ? <p className="form-message">{message}</p> : null}
        </form>
      </section>

      <section className="card">
        <h2>My Documents</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((item) => (
                <tr key={item._id}>
                  <td>{item.fileName}</td>
                  <td>{item.category}</td>
                  <td>{item.status}</td>
                  <td>{new Date(item.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </StudentLayout>
  )
}

export default StudentDocumentsPage
