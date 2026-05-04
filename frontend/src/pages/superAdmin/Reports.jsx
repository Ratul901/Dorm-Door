import { useEffect, useState } from 'react'
import { BedDouble, CheckCircle2, ClipboardList, FileClock, ReceiptText, XCircle } from 'lucide-react'
import StatCard from '../../components/superAdmin/StatCard'
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout'
import { getReports } from '../../services/superAdminApi'

const fallbackReports = {
  totalApplications: 0,
  approvedApplications: 0,
  rejectedApplications: 0,
  pendingTransactions: 0,
  approvedTransactions: 0,
  totalRooms: 0,
  availableRooms: 0,
  bookedRooms: 0,
  pendingDocuments: 0,
  solvedComplaints: 0,
}

function Reports() {
  const [reports, setReports] = useState(fallbackReports)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadReports() {
      setLoading(true)
      setError('')
      try {
        const { data } = await getReports()
        if (mounted) setReports({ ...fallbackReports, ...(data.reports || {}) })
      } catch (requestError) {
        if (mounted) setError(requestError.response?.data?.message || 'Failed to load reports')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadReports()
    return () => {
      mounted = false
    }
  }, [])

  const cards = [
    ['Total Applications', reports.totalApplications, ClipboardList],
    ['Approved Applications', reports.approvedApplications, CheckCircle2],
    ['Rejected Applications', reports.rejectedApplications, XCircle],
    ['Pending Transactions', reports.pendingTransactions, ReceiptText],
    ['Approved Transactions', reports.approvedTransactions, ReceiptText],
    ['Total Rooms', reports.totalRooms, BedDouble],
    ['Available Rooms', reports.availableRooms, BedDouble],
    ['Booked Rooms', reports.bookedRooms, BedDouble],
    ['Pending Documents', reports.pendingDocuments, FileClock],
    ['Solved Complaints', reports.solvedComplaints, CheckCircle2],
  ]

  return (
    <SuperAdminLayout title="Reports" subtitle="Simple operational totals for the dorm system.">
      {error ? <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value, Icon]) => (
          <StatCard key={label} label={label} value={loading ? '...' : value} icon={Icon} />
        ))}
      </div>
    </SuperAdminLayout>
  )
}

export default Reports
