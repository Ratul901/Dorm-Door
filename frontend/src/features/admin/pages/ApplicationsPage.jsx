import { useMemo, useState } from 'react'
import { FiDownload, FiEye, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { MdPendingActions, MdRateReview, MdCheckCircle, MdAnalytics } from 'react-icons/md'
import AdminLayout from '../components/layout/AdminLayout'
import { topbarAvatars } from '../data/dashboardData'

const applications = [
  {
    name: 'Elena Rodriguez',
    initials: 'ER',
    avatar: 'from-teal-500 to-cyan-600',
    id: '#ST-2024-0891',
    dorm: 'The Helix South',
    room: 'Premium Studio - Room 402',
    date: 'Oct 12, 2023',
    status: 'New',
  },
  {
    name: 'Marcus Chen',
    initials: 'MC',
    avatar: 'from-sky-500 to-indigo-600',
    id: '#ST-2024-0452',
    dorm: 'Willow Creek Hall',
    room: 'Shared Suite - Room 112B',
    date: 'Oct 11, 2023',
    status: 'Reviewing',
  },
  {
    name: 'Amara Okafor',
    initials: 'AO',
    avatar: 'from-emerald-500 to-teal-600',
    id: '#ST-2024-1120',
    dorm: 'The Helix North',
    room: 'Classic Single - Room 805',
    date: 'Oct 10, 2023',
    status: 'New',
  },
  {
    name: 'Julian Vane',
    initials: 'JV',
    avatar: 'from-orange-500 to-amber-600',
    id: '#ST-2024-0012',
    dorm: 'The Helix South',
    room: 'Classic Single - Room 312',
    date: 'Oct 10, 2023',
    status: 'Rejected',
  },
]

function getStatusStyle(status) {
  if (status === 'New') {
    return {
      badge: 'bg-blue-50 text-blue-700 ring-blue-700/10',
      dot: 'bg-blue-700',
    }
  }

  if (status === 'Reviewing') {
    return {
      badge: 'bg-amber-50 text-amber-700 ring-amber-700/10',
      dot: 'bg-amber-700',
    }
  }

  return {
    badge: 'bg-red-50 text-red-700 ring-red-700/10',
    dot: 'bg-red-700',
  }
}

function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const query = searchTerm.trim().toLowerCase()
      const matchesSearch =
        query === '' ||
        app.name.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query) ||
        app.dorm.toLowerCase().includes(query) ||
        app.room.toLowerCase().includes(query)

      const matchesStatus = statusFilter === 'All' || app.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const stats = useMemo(() => {
    const total = filteredApplications.length
    const reviewing = filteredApplications.filter((app) => app.status === 'Reviewing').length
    const approved = filteredApplications.filter((app) => app.status !== 'Rejected').length

    return [
      {
        icon: MdPendingActions,
        iconWrap: 'bg-blue-50 text-blue-700',
        badge: `${total} shown`,
        badgeClass: 'bg-blue-50 text-blue-600',
        label: 'Visible Applications',
        value: String(total),
      },
      {
        icon: MdRateReview,
        iconWrap: 'bg-amber-50 text-amber-700',
        label: 'Under Review',
        value: String(reviewing),
      },
      {
        icon: MdCheckCircle,
        iconWrap: 'bg-green-50 text-green-700',
        label: 'Non-Rejected',
        value: String(approved),
      },
      {
        icon: MdAnalytics,
        iconWrap: 'bg-slate-100 text-slate-700',
        label: 'Occupancy Rate',
        value: '94.2%',
      },
    ]
  }, [filteredApplications])

  return (
    <AdminLayout
      activeKey="applications"
      topbarProps={{
        searchPlaceholder: 'Search applications...',
        profileName: 'Admin Panel',
        profileRole: '',
        avatar: topbarAvatars.admin,
      }}
      contentClassName="p-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-primary">Management Portal</p>
            <h1 className="text-5xl font-black tracking-tighter">Application Stream</h1>
            <p className="mt-3 max-w-xl text-[18px] leading-8 text-secondary">
              Review and process student housing requests for the Fall 2024 academic session.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-soft">
            <FiDownload /> Export CSV
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <FiSearch />
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by student, ID, dorm, or room"
              className="w-full rounded-xl border border-[#ece7e4] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {['All', 'New', 'Reviewing', 'Rejected'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  statusFilter === status
                    ? 'bg-primary text-white'
                    : 'bg-[#f2efee] text-[#1c1b1b] hover:bg-[#ebe6e4]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const ItemIcon = item.icon
            return (
              <div key={item.label} className="rounded-xl border border-[#ece7e4] bg-white p-6 transition-all hover:border-blue-200">
                <div className="mb-4 flex items-start justify-between">
                  <div className={`rounded-xl p-3 ${item.iconWrap}`}><ItemIcon size={24} /></div>
                  {item.badge ? <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${item.badgeClass}`}>{item.badge}</span> : null}
                </div>
                <p className="mb-1 text-sm text-secondary">{item.label}</p>
                <h3 className="text-[18px] font-extrabold sm:text-[22px]">{item.value}</h3>
              </div>
            )
          })}
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-[#ece7e4] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-[#faf7f6]">
                <tr>
                  {['Student Name', 'Student ID', 'Applied Dorm/Room', 'Date', 'Status', 'Actions'].map((head) => (
                    <th key={head} className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.18em] text-secondary">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => {
                  const statusStyle = getStatusStyle(app.status)
                  return (
                    <tr key={app.id} className="border-t border-[#f0ebea]">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${app.avatar} text-sm font-bold text-white`}>
                            {app.initials}
                          </div>
                          <div className="text-[16px] font-bold leading-8">{app.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-[18px] text-secondary">{app.id}</td>
                      <td className="px-6 py-6">
                        <div className="text-[18px] font-semibold">{app.dorm}</div>
                        <div className="text-sm text-secondary">{app.room}</div>
                      </td>
                      <td className="px-6 py-6 text-[18px] text-secondary">{app.date}</td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ${statusStyle.badge}`}>
                          <span className={`h-2.5 w-2.5 rounded-full ${statusStyle.dot}`} />
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-6"><button className="rounded-lg p-2 text-primary hover:bg-blue-50"><FiEye size={18} /></button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-5 text-sm text-secondary">
            <p>Showing 1-{filteredApplications.length} of {filteredApplications.length} applications</p>
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-2 hover:bg-[#f2efee]"><FiChevronLeft /></button>
              <button className="rounded-lg bg-primary px-3 py-2 text-white">1</button>
              <button className="rounded-lg p-2 hover:bg-[#f2efee]"><FiChevronRight /></button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ApplicationsPage
