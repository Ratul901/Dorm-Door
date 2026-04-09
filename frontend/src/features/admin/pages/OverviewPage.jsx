import { Link } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import Icon from '../components/Icon'
import { topbarAvatars } from '../data/dashboardData'

const statCards = [
  { label: 'Estate Total', value: '12', sub: 'Total Dorms', icon: 'domain', tone: 'bg-white' },
  { label: 'Inventory', value: '1,480', sub: 'Total Rooms', icon: 'bed', tone: 'bg-white' },
  { label: 'Availability', value: '142', sub: 'Available Rooms', icon: 'inventory_2', tone: 'bg-primary text-white' },
  { label: 'Queue', value: '84', sub: 'Pending Apps', icon: 'more_horiz', tone: 'bg-[#dfeaf3]' },
  { label: 'Efficiency', value: '1,120', sub: 'Approved Apps', icon: 'verified', tone: 'bg-white' },
  { label: 'Action Required', value: '19', sub: 'Documents Pending', icon: 'warning', tone: 'bg-[#fde7e5]' },
]

const activity = [
  ['Maya Sterling', 'submitted an application for', 'The Grand Hall', '2 minutes ago - Studio Unit 402', 'Pending'],
  ['Medical Record', 'verified for', 'Lucas Vance', '15 minutes ago - System Automated', 'Success'],
  ['Julian Thorne', 'requested a maintenance check in', 'East Wing', '1 hour ago - Room 22B', 'Urgent'],
  ['Weekly Broadcast', 'sent to all residents', '', '3 hours ago - Facility Update', 'Sent'],
]

function OverviewPage() {
  return (
    <AdminLayout
      activeKey="overview"
      topbarProps={{
        searchPlaceholder: 'Search applications or students...',
        brandText: 'Dorm Admin',
        showBrand: true,
        profileName: 'Admin Panel',
        profileRole: '',
        avatar: topbarAvatars.admin,
      }}
      contentClassName="p-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">System Pulse</p>
            <h1 className="text-6xl font-black tracking-tighter leading-none">Overview</h1>
            <p className="mt-4 max-w-2xl text-[18px] leading-8 text-secondary">
              A panoramic view of housing operations, student flow, and facility capacity across the estate.
            </p>
          </div>
          <Link to="/admin/applications" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-soft">
            <Icon name="add" /> New Application
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card, index) => (
            <div key={card.label} className={`rounded-3xl border border-[#ece7e4] p-6 ${card.tone}`}>
              <div className="mb-6 flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index === 2 ? 'bg-white/15' : 'bg-[#edf3ff]'}`}>
                  <Icon name={card.icon} className={index === 2 ? 'text-white' : 'text-primary'} />
                </div>
                <span className={`text-sm ${index === 2 ? 'text-white/80' : 'text-secondary'}`}>{card.label}</span>
              </div>
              <div className={`text-5xl font-black ${index === 5 ? 'text-error' : ''}`}>{card.value}</div>
              <p className={`mt-2 text-xl ${index === 2 ? 'text-white' : index === 5 ? 'text-error' : 'text-[#1c1b1b]'}`}>{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[24px] font-extrabold">Recent Activity</h2>
              <button className="text-sm font-semibold text-primary">View All Operations</button>
            </div>
            <div className="space-y-5">
              {activity.map((item, i) => (
                <div key={i} className="flex items-start gap-4 rounded-2xl bg-transparent p-1">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full ${i === 0 ? 'bg-[#d9edf9]' : i === 1 ? 'bg-[#dff2f1]' : i === 2 ? 'bg-[#f3e6e1]' : 'bg-[#ebe8ff]'}`}>
                    <Icon name={i === 0 ? 'person' : i === 1 ? 'description' : i === 2 ? 'person' : 'campaign'} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[17px] leading-7 text-[#1c1b1b]">
                      <span className="font-bold">{item[0]}</span> {item[1]} {item[2] && <span className="font-bold">{item[2]}</span>}
                    </p>
                    <p className="text-sm text-secondary">{item[3]}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${i === 0 ? 'bg-blue-50 text-primary' : i === 1 ? 'bg-green-50 text-green-700' : i === 2 ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                    {item[4]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-5">
            <h2 className="mb-4 text-[24px] font-extrabold">Occupancy Trend</h2>
            <div className="rounded-3xl border border-[#ece7e4] bg-white p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Global Capacity</p>
                  <p className="mt-2 text-5xl font-black text-primary">94.2%</p>
                </div>
                <div className="flex gap-2 text-xs font-bold">
                  <span className="rounded-md bg-primary px-2 py-1 text-white">LIVE</span>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-secondary">+1.2%</span>
                </div>
              </div>
              <div className="mt-10 flex items-end gap-4">
                {[48, 62, 74, 68, 96, 58].map((h, i) => (
                  <div key={i} className={`w-12 rounded-t-2xl ${i === 4 ? 'bg-primary shadow-lg shadow-blue-500/20' : i === 5 ? 'border-2 border-dashed border-[#cbd7ec] bg-transparent' : 'bg-[#efebea]'}`} style={{ height: `${h * 2}px` }} />
                ))}
                <div className="ml-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-soft">
                  <Icon name="bolt" filled className="text-4xl" />
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between text-sm text-secondary">
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary" />Current</span>
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#efebea]" />Projected</span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-secondary">
              {['High-speed Wi-Fi', 'Smart Laundry', '24/7 Gym', 'Biometric Access'].map((item) => (
                <span key={item} className="rounded-full bg-white px-4 py-2 shadow-sm">{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#f2efee] px-8 py-8 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-[32px] font-extrabold">Housing Maintenance Queue</h3>
            <p className="mt-2 max-w-2xl text-secondary">There are currently 12 open tickets requiring technical intervention. Prioritize based on student impact.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/support" className="rounded-2xl bg-white px-6 py-4 font-semibold text-[#1c1b1b]">Manage Tickets</Link>
            <button className="rounded-2xl bg-[#111111] px-6 py-4 font-semibold text-white">Assign Staff</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default OverviewPage


