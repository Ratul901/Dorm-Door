import { useEffect, useMemo, useState } from 'react'
import { Eye, Lock, Search, Unlock } from 'lucide-react'
import DataTable from '../../components/superAdmin/DataTable'
import SimpleModal from '../../components/superAdmin/SimpleModal'
import StatusBadge from '../../components/superAdmin/StatusBadge'
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout'
import { getStudents, updateStudentStatus } from '../../services/superAdminApi'

function StudentManagement() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)

  const loadStudents = async (query = search) => {
    setLoading(true)
    setError('')

    try {
      const { data } = await getStudents(query ? { search: query } : {})
      setStudents(data.students || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents('')
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    loadStudents(search)
  }

  const toggleStatus = async (student) => {
    const next = student.accountStatus === 'blocked' ? 'active' : 'blocked'
    try {
      await updateStudentStatus(student._id, next)
      await loadStudents(search)
      setMessage(`Student ${next === 'blocked' ? 'blocked' : 'unblocked'} successfully.`)
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Failed to update student status.')
    }
  }

  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Name',
        render: (row) => (
          <div>
            <p className="font-black text-slate-950">{row.name}</p>
            <p className="text-xs text-slate-500">{row.studentId || row.referenceId}</p>
          </div>
        ),
      },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone', render: (row) => row.phone || 'N/A' },
      { key: 'referenceId', label: 'Reference ID' },
      { key: 'applicationStatus', label: 'Application Status', render: (row) => <StatusBadge status={row.applicationStatus} /> },
      { key: 'paymentStatus', label: 'Payment Status', render: (row) => <StatusBadge status={row.paymentStatus} /> },
      { key: 'documentStatus', label: 'Document Status', render: (row) => <StatusBadge status={row.documentStatus} /> },
      {
        key: 'actions',
        label: 'Actions',
        render: (row) => (
          <div className="flex gap-2">
            <button type="button" onClick={() => setSelectedStudent(row)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="View">
              <Eye size={16} />
            </button>
            <button type="button" onClick={() => toggleStatus(row)} className="rounded-lg p-2 text-amber-700 hover:bg-amber-50" title="Block or unblock">
              {row.accountStatus === 'blocked' ? <Unlock size={16} /> : <Lock size={16} />}
            </button>
          </div>
        ),
      },
    ],
    [search],
  )

  return (
    <SuperAdminLayout title="Students" subtitle="Search students and review their application, payment, and document status.">
      <form onSubmit={handleSearch} className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, phone, or reference ID"
            className="w-full rounded-lg border border-[#e8edf3] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </label>
        <button type="submit" className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white">Search</button>
      </form>

      {error ? <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {message ? <p className="mb-5 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">{message}</p> : null}

      <DataTable columns={columns} rows={students} loading={loading} emptyMessage="No students found." />

      {selectedStudent ? (
        <SimpleModal title="Student Profile" onClose={() => setSelectedStudent(null)}>
          <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
            <p><strong>Name:</strong> {selectedStudent.name}</p>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <p><strong>Phone:</strong> {selectedStudent.phone || 'N/A'}</p>
            <p><strong>Student ID:</strong> {selectedStudent.studentId || 'N/A'}</p>
            <p><strong>Department:</strong> {selectedStudent.department || 'N/A'}</p>
            <p><strong>University:</strong> {selectedStudent.university || 'N/A'}</p>
            <p><strong>Application:</strong> {selectedStudent.applicationStatus}</p>
            <p><strong>Payment:</strong> {selectedStudent.paymentStatus}</p>
            <p><strong>Documents:</strong> {selectedStudent.documentStatus}</p>
            <p><strong>Account:</strong> {selectedStudent.accountStatus === 'blocked' ? 'Blocked' : 'Active'}</p>
          </div>
        </SimpleModal>
      ) : null}
    </SuperAdminLayout>
  )
}

export default StudentManagement
