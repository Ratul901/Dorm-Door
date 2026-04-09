import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'

const MENU = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'applications', label: 'Room Applications', icon: 'domain' },
  { key: 'maintenance', label: 'Maintenance', icon: 'build' },
  { key: 'documents', label: 'Documents', icon: 'description' },
  { key: 'reviews', label: 'Reviews', icon: 'rate_review' },
  { key: 'profile', label: 'Profile', icon: 'person' },
]

const PAGE_TO_PATH = {
  dashboard: '/student',
  applications: '/student/applications',
  maintenance: '/student/maintenance',
  documents: '/student/documents',
  reviews: '/student/reviews',
  profile: '/student/profile',
  support: '/student/support',
}

function pathToPage(pathname) {
  const entry = Object.entries(PAGE_TO_PATH).find(([, path]) => path === pathname)
  return entry ? entry[0] : 'dashboard'
}

function Icon({ name, filled = false, className = '' }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
    >
      {name}
    </span>
  )
}

function Avatar({ src, alt = 'avatar', className = '' }) {
  return <img src={src} alt={alt} className={`rounded-full object-cover ${className}`} />
}

function Sidebar({ activePage, setActivePage, onSignOut }) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[250px] flex-col border-r border-[#ece8e6] bg-[#fcf9f8] px-4 py-7">
      <div className="mb-8 px-3">
        <h1 className="text-[17px] font-extrabold tracking-[-0.04em] text-[#171717]">Dorm Door</h1>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">Student Portal</p>
      </div>

      <nav className="space-y-2">
        {MENU.map((item) => {
          const active = activePage === item.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActivePage(item.key)}
              className={`sidebar-item flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-[14px] transition ${
                active
                  ? 'bg-white font-bold text-[#0c56d0] shadow-[0_2px_10px_rgba(0,0,0,0.04)] ring-1 ring-[#efebea]'
                  : 'text-[#5f6772] hover:bg-[#f3efed]'
              }`}
            >
              <Icon name={item.icon} filled={active} className="text-[17px]" />
              <span>{item.label}</span>
              {active ? <span className="ml-auto h-8 w-[4px] rounded-full bg-[#0c56d0]" /> : null}
            </button>
          )
        })}
      </nav>
      <div className="mt-auto space-y-2 border-t border-[#ebe6e3] px-2 pt-8">
        <button
          type="button"
          onClick={() => setActivePage('support')}
          className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-[13px] text-[#5f6772] transition hover:bg-[#f3efed]"
        >
          <Icon name="help" className="text-[17px]" />
          <span>Support</span>
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-[13px] text-[#d03030] transition hover:bg-[#fff1f1]"
        >
          <Icon name="logout" className="text-[17px]" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

function Topbar({ placeholder = 'Search portal...' }) {
  const { language, setLanguage } = useLanguage()

  return (
    <header className="fixed left-[250px] right-0 top-0 z-30 border-b border-[#ece8e6] bg-[#fcf9f8]/90 px-8 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-6">
        <div className="fade-in w-full max-w-[410px] rounded-full bg-[#f4f1f0] px-5 py-3.5 text-[#9096a1] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <Icon name="search" className="text-[17px] text-[#8f96a3]" />
            <input className="w-full border-none bg-transparent outline-none placeholder:text-[#9198a5]" placeholder={placeholder} />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div data-no-translate="true" className="hidden items-center gap-2 text-xs font-bold tracking-widest text-secondary md:flex">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`transition hover:text-[#0c56d0] ${language === 'en' ? 'text-[#0c56d0]' : ''}`}
            >
              EN
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`transition hover:text-[#0c56d0] ${language === 'bn' ? 'text-[#0c56d0]' : ''}`}
            >
              BN
            </button>
          </div>
          <button type="button" className="relative text-[#626b77]">
            <Icon name="notifications" className="text-[20px]" />
            <span className="pulse-dot absolute -right-1 top-0 h-2 w-2 rounded-full bg-[#e11d48]" />
          </button>
          <button type="button" className="text-[#626b77]">
            <Icon name="settings" className="text-[20px]" />
          </button>
          <Avatar
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80"
            className="h-11 w-11 ring-2 ring-white"
          />
        </div>
      </div>
    </header>
  )
}

function PageFrame({ children, placeholder }) {
  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b]">
      <Topbar placeholder={placeholder} />
      <main className="ml-[250px] px-10 pb-10 pt-[102px]">{children}</main>
    </div>
  )
}

function StatBox({ icon, label, value, chip, chipClass = 'bg-[#dceaf3] text-[#46606d]' }) {
  return (
    <div className="card-hover rounded-[28px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] ring-1 ring-[#eeebea]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3f7] text-[#3e5663]">
          <Icon name={icon} className="text-[20px]" />
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${chipClass}`}>{chip}</span>
      </div>
      <p className="mt-5 text-[13px] uppercase tracking-[0.18em] text-[#6b7280]">{label}</p>
      <h3 className="mt-1 text-[18px] font-extrabold tracking-[-0.04em]">{value}</h3>
    </div>
  )
}

function DashboardPage({ setActivePage }) {
  const docs = [
    ['Student ID Card', 'Uploaded March 25', 'Verified', true],
    ['Passport Photo', 'Uploaded March 25', 'Verified', true],
    ['Admission Certificate', 'Missing digital copy', 'Pending', false],
  ]

  return (
    <PageFrame placeholder="Search resources...">
      <div className="grid grid-cols-4 gap-5">
        <StatBox icon="inventory_2" label="Application" value="Review Phase" chip="Pending" chipClass="bg-[#eef0ff] text-[#4a5fd2]" />
        <StatBox icon="apartment" label="Dorm" value="The Zenith Suite" chip="Reserved" />
        <StatBox icon="description" label="Documents" value="Verified" chip="2/3 Done" />
        <StatBox icon="notifications_active" label="Alerts" value="Action Needed" chip="3 New" chipClass="bg-[#ffe8e8] text-[#c93131]" />
      </div>

      <div className="mt-8 grid grid-cols-[1.8fr_0.9fr] gap-8">
        <div>
          <section className="fade-in rounded-[28px] bg-[#0c56d0] p-8 text-white shadow-[0_20px_40px_rgba(12,86,208,0.18)]">
            <div className="grid grid-cols-[1.5fr_0.9fr] gap-8">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-white/70">Current Application</p>
                <h2 className="mt-4 text-[44px] font-extrabold leading-[1.02] tracking-[-0.06em]">The Zenith Suite</h2>
                <div className="mt-4 flex gap-3 text-[12px] font-bold uppercase tracking-[0.12em]">
                  <span className="rounded-full bg-white/15 px-4 py-2">Block A</span>
                  <span className="rounded-full bg-white/15 px-4 py-2">Single Room</span>
                </div>
                <div className="mt-8 flex items-center gap-5">
                  <div className="rounded-2xl bg-white/15 px-5 py-3 text-[24px] font-bold tracking-[-0.04em]">Under Review</div>
                  <p className="text-[14px] text-white/75">Submitted March 25</p>
                </div>
              </div>

              <div className="rounded-[24px] bg-white/10 p-6 ring-1 ring-white/12">
                <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-white/75">Assigned Room</p>
                <div className="mt-4 rounded-[22px] border border-dashed border-white/20 px-4 py-10 text-center text-white/65">
                  <Icon name="meeting_room" className="text-[36px]" />
                  <p className="mt-4 text-[14px]">Pending assignment</p>
                </div>
                <button type="button" className="mt-5 w-full rounded-2xl bg-white py-3.5 font-bold text-[#0c56d0]">View Timeline</button>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[28px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] ring-1 ring-[#eeebea]">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[17px] font-extrabold tracking-[-0.04em]">Required Documents</h3>
              <span className="rounded-full bg-[#f1efee] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b7280]">Step 2 of 3</span>
            </div>
            <div className="space-y-4">
              {docs.map(([title, sub, status, done]) => (
                <div key={title} className={`flex items-center gap-4 rounded-[22px] px-5 py-5 ${done ? 'bg-[#fbfbfb]' : 'bg-[#fff4f4]'}`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${done ? 'bg-[#eef3ff] text-[#0c56d0]' : 'bg-[#ffe6e6] text-[#d33434]'}`}>
                    <Icon name={done ? 'badge' : 'description'} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold">{title}</p>
                    <p className={`text-[13px] ${done ? 'text-[#7b818c]' : 'text-[#c73535]'}`}>{sub}</p>
                  </div>
                  {done ? (
                    <span className="rounded-full bg-[#eef5ff] px-4 py-2 text-[12px] font-bold text-[#0c56d0]">Verified</span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-bold text-[#d33434]">PENDING</span>
                      <button type="button" onClick={() => setActivePage('documents')} className="rounded-full bg-[#0c56d0] px-5 py-2 text-[13px] font-bold text-white">Upload</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card-hover rounded-[28px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] ring-1 ring-[#eeebea]">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[17px] font-extrabold tracking-[-0.04em]">Student Profile</h3>
              <button type="button" onClick={() => setActivePage('profile')} className="text-[12px] font-bold text-[#0c56d0]">EDIT</button>
            </div>
            <div className="text-center">
              <Avatar src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80" className="mx-auto h-24 w-24 ring-4 ring-[#f0edec]" />
              <h4 className="mt-4 text-[17px] font-extrabold tracking-[-0.04em]">Alex Thompson</h4>
              <p className="mt-1 text-[13px] font-semibold text-[#0c56d0]">ID: #STU-2024098</p>
            </div>
            <div className="mt-6 space-y-3 border-t border-[#efebea] pt-5 text-[13px]">
              <div className="flex justify-between"><span className="text-[#7b818c]">Department</span><span className="font-semibold">Architecture &amp; Design</span></div>
              <div className="flex justify-between"><span className="text-[#7b818c]">Phone</span><span className="font-semibold">+1 (555) 012-3456</span></div>
              <div className="flex justify-between"><span className="text-[#7b818c]">Email</span><span className="font-semibold">a.thompson@atelier.edu</span></div>
            </div>
          </section>

          <section className="card-hover rounded-[28px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] ring-1 ring-[#eeebea]">
            <h3 className="text-[17px] font-extrabold tracking-[-0.04em]">Recent Activity</h3>
            <div className="mt-5 space-y-5 text-[13px]">
              <div className="flex gap-4"><span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#0c56d0]" /><div><p className="font-bold">Application received</p><p className="text-[#7b818c]">Mar 25, 10:30 AM</p></div></div>
              <div className="flex gap-4"><span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#9ca3af]" /><div><p className="font-bold">Documents verified</p><p className="text-[#7b818c]">Mar 26, 02:15 PM</p></div></div>
            </div>
          </section>

          <section className="rounded-[28px] bg-[#274b5a] p-6 text-white shadow-[0_12px_24px_rgba(39,75,90,0.18)]">
            <h3 className="text-[17px] font-extrabold tracking-[-0.04em]">Need Support?</h3>
            <p className="mt-3 text-[13px] leading-6 text-white/75">Our team is available 24/7 for any housing assistance.</p>
            <button type="button" onClick={() => setActivePage('support')} className="mt-5 w-full rounded-2xl bg-white py-3.5 font-bold text-[#274b5a]">Chat Support</button>
            <button type="button" onClick={() => setActivePage('support')} className="mt-3 w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 font-bold text-white">Contact Admin</button>
          </section>
        </div>
      </div>

      <p className="mt-10 text-center text-[11px] uppercase tracking-[0.35em] text-[#7a8088]">© 2024 The Atelier Student Housing • Academic Elite Standard</p>
    </PageFrame>
  )
}

function RoomApplicationsPage() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isDemoUser = token === 'dormdoor_demo_token'
  const demoStorageKey = 'dormdoor_demo_student_applications'

  const parseDemoApplications = (raw) => {
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : null
    } catch {
      return null
    }
  }

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true)
      setError('')

      if (isDemoUser) {
        const stored = parseDemoApplications(localStorage.getItem(demoStorageKey))
        if (stored) {
          setApplications(stored)
          setLoading(false)
          return
        }

        const seed = [
          {
            _id: 'demo-app-1',
            dorm: { name: 'The Zenith Suite', block: 'Block A' },
            room: { roomNumber: '402-A', type: 'Premium Studio' },
            status: 'Under Review',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            preferences: { moveInDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString() },
          },
          {
            _id: 'demo-app-2',
            dorm: { name: 'Scholar Haven', block: 'Block B' },
            room: { roomNumber: '205-C', type: 'Single Room' },
            status: 'Approved',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            preferences: { moveInDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
          },
        ]

        localStorage.setItem(demoStorageKey, JSON.stringify(seed))
        setApplications(seed)
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get('/applications')
        setApplications(data.applications || [])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load applications')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [isDemoUser, token])

  const activeApplications = useMemo(() => {
    const statuses = new Set(['Pending', 'Under Review', 'Re-upload Requested'])
    return applications.filter((item) => statuses.has(item.status))
  }, [applications])

  const historicalApplications = useMemo(() => {
    const statuses = new Set(['Approved', 'Rejected'])
    return applications.filter((item) => statuses.has(item.status))
  }, [applications])

  const nextMoveIn = useMemo(() => {
    const upcoming = applications
      .map((item) => item.preferences?.moveInDate)
      .filter(Boolean)
      .map((date) => new Date(date))
      .filter((date) => !Number.isNaN(date.getTime()) && date.getTime() >= Date.now())
      .sort((a, b) => a.getTime() - b.getTime())

    return upcoming[0] || null
  }, [applications])

  const pendingCount = useMemo(
    () => applications.filter((item) => item.status === 'Pending' || item.status === 'Under Review').length,
    [applications],
  )

  const createDemoApplication = () => {
    const createdAt = new Date()
    const newItem = {
      _id: `demo-app-${createdAt.getTime()}`,
      dorm: { name: 'New Demo Dorm', block: 'Block C' },
      room: { roomNumber: 'TBD', type: 'Single Room' },
      status: 'Pending',
      createdAt: createdAt.toISOString(),
      preferences: {},
    }

    const next = [newItem, ...applications]
    setApplications(next)
    localStorage.setItem(demoStorageKey, JSON.stringify(next))
  }

  const handleNewApplication = () => {
    if (isDemoUser) {
      createDemoApplication()
      return
    }
    navigate('/apply-now')
  }

  const statusClasses = (status) => {
    if (status === 'Pending') return 'bg-[#fff2de] text-[#b7791f]'
    if (status === 'Under Review' || status === 'Re-upload Requested') return 'bg-[#e8f0f7] text-[#4e6875]'
    if (status === 'Approved') return 'bg-[#ecf7ef] text-[#23945b]'
    return 'bg-[#feecef] text-[#d33434]'
  }

  const formatDate = (value) => {
    if (!value) return 'Not available'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return 'Not available'
    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
  }

  const Row = ({ item, faded = false }) => {
    const dormName = item.dorm?.name || 'Dorm not assigned'
    const roomType = item.room?.type || item.preferences?.preferredRoomType || 'Not specified'
    const statusText = item.status || 'Pending'
    const block = item.dorm?.block ? ` - ${item.dorm.block}` : ''

    return (
      <div className={`grid grid-cols-[110px_1.2fr_1fr_1fr_180px_56px] items-center gap-6 rounded-[26px] bg-white px-6 py-6 ring-1 ring-[#efebea] ${faded ? 'opacity-65' : ''}`}>
        <img src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=300&q=80" alt={dormName} className="h-24 w-24 rounded-2xl object-cover" />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7b818c]">Dorm Name</p>
          <p className="mt-2 text-[15px] font-extrabold tracking-[-0.03em]">{dormName}{block}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7b818c]">Room Type</p>
          <p className="mt-2 text-[14px]">{roomType}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7b818c]">Submitted</p>
          <p className="mt-2 text-[14px]">{formatDate(item.createdAt)}</p>
        </div>
        <div>
          <span className={`inline-flex rounded-full px-4 py-2 text-[13px] font-bold ${statusClasses(statusText)}`}>
            {statusText}
          </span>
        </div>
        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f2f1] text-[#333]">
          <Icon name="chevron_right" />
        </button>
      </div>
    )
  }

  return (
    <PageFrame placeholder="Search applications...">
      <div className="flex items-start justify-between gap-8">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#6b7280]">Housing Portal</p>
          <h1 className="mt-3 text-[48px] font-extrabold leading-none tracking-[-0.06em]">Room Applications</h1>
          <p className="mt-4 max-w-[760px] text-[16px] leading-8 text-[#546067]">
            Track your submitted applications, monitor status updates, and start a new request.
          </p>
        </div>
        <button type="button" onClick={handleNewApplication} className="interactive mt-6 rounded-[22px] bg-[#0c56d0] px-8 py-5 text-[16px] font-bold text-white shadow-[0_14px_24px_rgba(12,86,208,0.16)]">
          + New Application
        </button>
      </div>

      {isDemoUser ? (
        <p className="mt-6 rounded-xl bg-[#eef3ff] px-4 py-3 text-sm font-semibold text-[#325ca8]">
          Demo mode: new applications are stored locally in this browser.
        </p>
      ) : null}

      <div className="mt-10 grid grid-cols-[260px_260px_1fr] gap-6">
        <div className="card-hover rounded-[28px] bg-white p-6 ring-1 ring-[#efebea]">
          <p className="text-[13px] uppercase tracking-[0.2em] text-[#6b7280]">Total Active</p>
          <h3 className="mt-5 text-[52px] font-extrabold leading-none text-[#0c56d0]">{activeApplications.length}</h3>
        </div>
        <div className="card-hover rounded-[28px] bg-white p-6 ring-1 ring-[#efebea]">
          <p className="text-[13px] uppercase tracking-[0.2em] text-[#6b7280]">Pending Review</p>
          <h3 className="mt-5 text-[52px] font-extrabold leading-none text-[#b7791f]">{pendingCount}</h3>
        </div>
        <div className="card-hover rounded-[28px] bg-white p-6 ring-1 ring-[#efebea]">
          <p className="text-[13px] uppercase tracking-[0.2em] text-[#6b7280]">Next Move-In Date</p>
          <h3 className="mt-5 text-[30px] font-extrabold tracking-[-0.04em]">
            {nextMoveIn ? nextMoveIn.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}
          </h3>
          <p className="mt-2 text-[16px] text-[#546067]">Based on your submitted preferences</p>
        </div>
      </div>

      {loading ? (
        <p className="mt-10 text-[16px] font-semibold text-[#546067]">Loading applications...</p>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-xl bg-[#ffe9ec] px-4 py-3 text-sm font-semibold text-[#c73535]">{error}</p>
      ) : null}

      {!loading && !error ? (
        <>
          <section className="mt-12">
            <div className="mb-6 flex items-center gap-5">
              <h2 className="text-[18px] font-extrabold tracking-[-0.04em]">Active Inquiries</h2>
              <div className="h-px flex-1 bg-[#e7e2df]" />
            </div>

            {activeApplications.length === 0 ? (
              <div className="rounded-[24px] bg-white px-6 py-8 text-[15px] text-[#546067] ring-1 ring-[#efebea]">
                No active applications found.
              </div>
            ) : (
              <div className="space-y-5">{activeApplications.map((item) => <Row key={item._id} item={item} />)}</div>
            )}
          </section>

          <section className="mt-12">
            <div className="mb-6 flex items-center gap-5">
              <h2 className="text-[18px] font-extrabold tracking-[-0.04em]">Historical Records</h2>
              <div className="h-px flex-1 bg-[#e7e2df]" />
            </div>

            {historicalApplications.length === 0 ? (
              <div className="rounded-[24px] bg-white px-6 py-8 text-[15px] text-[#546067] ring-1 ring-[#efebea]">
                No historical applications yet.
              </div>
            ) : (
              <div className="space-y-5">{historicalApplications.map((item) => <Row key={item._id} item={item} faded />)}</div>
            )}
          </section>
        </>
      ) : null}
    </PageFrame>
  )
}

function MaintenancePage() {
  const rows = [
    ['#MT-8829', 'plumbing', 'Bathroom Sink Clog', 'Slow drainage in ensuite bath', 'Oct 24, 2023', 'Pending'],
    ['#MT-8812', 'bolt', 'Flickering Desk Lamp', 'Outlet voltage inconsistency suspected', 'Oct 22, 2023', 'Scheduled'],
    ['#MT-8794', 'chair', 'Loose Desk Drawer', 'Right-side rail alignment repair', 'Oct 18, 2023', 'Resolved'],
  ]

  return (
    <PageFrame placeholder="Search requests or guides...">
      <div className="flex items-start justify-between gap-8">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#6b7280]">Service Center</p>
          <h1 className="mt-3 text-[48px] font-extrabold leading-none tracking-[-0.06em]">Maintenance Requests</h1>
          <p className="mt-4 max-w-[850px] text-[16px] leading-8 text-[#546067]">Ensure your sanctuary remains pristine. Report any issues within your suite and track our engineering team's progress in real-time.</p>
        </div>
        <button type="button" className="interactive mt-6 rounded-[22px] bg-[#0c56d0] px-8 py-5 text-[16px] font-bold text-white shadow-[0_14px_24px_rgba(12,86,208,0.16)]">+ Report Issue</button>
      </div>

      <div className="mt-10 grid grid-cols-[280px_280px_1fr] gap-6">
        <div className="card-hover rounded-[28px] bg-white p-6 ring-1 ring-[#efebea]"><div className="flex items-start justify-between"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dceaf3] text-[#0c56d0]"><Icon name="pending_actions" /></div><h3 className="text-[38px] font-extrabold tracking-[-0.06em]">02</h3></div><p className="mt-6 text-[16px] font-bold">Active Requests</p><p className="text-[14px] text-[#6b7280]">Awaiting technician assignment</p></div>
        <div className="card-hover rounded-[28px] bg-white p-6 ring-1 ring-[#efebea]"><div className="flex items-start justify-between"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff0f6] text-[#46606d]"><Icon name="event_available" /></div><h3 className="text-[38px] font-extrabold tracking-[-0.06em]">01</h3></div><p className="mt-6 text-[16px] font-bold">Scheduled Visits</p><p className="text-[14px] text-[#6b7280]">Tech arriving tomorrow, 10:00 AM</p></div>
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#0b356f,#0c56d0)] p-6 text-white shadow-[0_14px_28px_rgba(12,86,208,0.18)]"><p className="text-[12px] font-bold uppercase tracking-[0.28em] text-white/70">Response Guarantee</p><h3 className="mt-5 text-[32px] font-extrabold leading-tight tracking-[-0.05em]">24-Hour Resolution Target</h3></div>
      </div>

      <section className="mt-10 rounded-[30px] bg-[#f4f1f0] p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[20px] font-extrabold tracking-[-0.04em]">Recent Submissions</h2>
          <div className="flex gap-8 text-[14px] font-semibold text-[#546067]"><span className="rounded-full bg-white px-4 py-2 text-[#0c56d0]">All Status</span><span>Pending</span><span>Scheduled</span></div>
        </div>
        <div className="mb-4 grid grid-cols-[140px_1.4fr_180px_210px_120px] px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6b7280]">
          <div>Request ID</div><div>Category &amp; Description</div><div>Date Reported</div><div>Current Status</div><div>Actions</div>
        </div>
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row[0]} className={`grid grid-cols-[140px_1.4fr_180px_210px_120px] items-center rounded-[24px] bg-white px-6 py-5 ${row[5] === 'Resolved' ? 'opacity-75' : ''}`}>
              <div className="font-bold text-[#0c56d0]">{row[0]}</div>
              <div className="flex items-center gap-4"><div className={`flex h-12 w-12 items-center justify-center rounded-full ${row[5] === 'Resolved' ? 'bg-[#efebea] text-[#6b7280]' : 'bg-[#dceaf3] text-[#46606d]'}`}><Icon name={row[1]} /></div><div><p className="text-[17px] font-bold tracking-[-0.03em]">{row[2]}</p><p className="text-[14px] text-[#6b7280]">{row[3]}</p></div></div>
              <div className="text-[16px]">{row[4]}</div>
              <div><span className={`inline-flex rounded-full px-4 py-2 text-[13px] font-bold ${row[5] === 'Pending' ? 'bg-[#fff2de] text-[#b7791f]' : row[5] === 'Scheduled' ? 'bg-[#e9f0ff] text-[#4775d6]' : 'bg-[#ecf7ef] text-[#23945b]'}`}>{row[5]}</span></div>
              <div className="text-[14px] font-semibold text-[#0c56d0]">{row[5] === 'Pending' ? 'View Details' : row[5] === 'Scheduled' ? 'Oct 26' : <Icon name="receipt_long" className="text-[#6b7280]" />}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 grid grid-cols-[1fr_1.1fr] gap-8">
        <section className="relative overflow-hidden rounded-[30px] bg-white p-8 ring-1 ring-[#efebea]">
          <h3 className="text-[18px] font-extrabold tracking-[-0.04em]">Emergency Protocol</h3>
          <p className="mt-5 max-w-[470px] text-[16px] leading-8 text-[#546067]">For life-threatening emergencies, fire, or major floods, please use the 24/7 Concierge Hotline immediately.</p>
          <button type="button" className="mt-8 text-[20px] font-extrabold text-[#0c56d0]">Contact Concierge →</button>
          <div className="absolute bottom-3 right-4 text-[180px] leading-none text-[#f2efee]">✱</div>
        </section>

        <section>
          <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.28em] text-[#6b7280]">Maintenance Guides</p>
          <div className="space-y-4">
            {['Managing Humidity in Suites', 'Smart Lighting Setup Guide'].map((guide) => (
              <div key={guide} className="flex items-center justify-between rounded-[24px] bg-white px-6 py-5 ring-1 ring-[#efebea]">
                <div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#0c56d0]"><Icon name="tips_and_updates" /></div><p className="text-[17px] font-bold tracking-[-0.03em]">{guide}</p></div>
                <Icon name="chevron_right" className="text-[#6b7280]" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageFrame>
  )
}

function DocumentsPage() {
  return (
    <PageFrame placeholder="Search files, guides...">
      <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#6b7280]">Registry &amp; Verification</p>
      <h1 className="mt-3 text-[48px] font-extrabold leading-none tracking-[-0.06em]">Academic Credentials</h1>
      <p className="mt-4 max-w-[900px] text-[16px] leading-8 text-[#546067]">Manage your essential identification and academic records. Ensuring your profile is fully verified grants you seamless access to all dormitory amenities and priority room selection.</p>

      <div className="mt-10 grid grid-cols-[1.6fr_340px] gap-8">
        <section className="rounded-[30px] bg-white p-8 ring-1 ring-[#efebea]">
          <div className="grid grid-cols-[320px_1fr] gap-8">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80" alt="ID card" className="h-[260px] w-full rounded-[24px] object-cover" />
            <div>
              <div className="flex gap-3">
                <span className="rounded-full bg-[#eef0ff] px-4 py-2 text-[12px] font-bold text-[#4a5fd2]">ID CARD</span>
                <span className="rounded-full bg-[#e9f6ed] px-4 py-2 text-[12px] font-bold text-[#24925e]">VERIFIED</span>
              </div>
              <h2 className="mt-5 text-[38px] font-extrabold leading-tight tracking-[-0.05em]">National Identity Document</h2>
              <p className="mt-4 max-w-[500px] text-[16px] leading-8 text-[#546067]">Verification completed on Oct 12, 2023. This document is valid for the duration of the current academic year.</p>
              <div className="mt-8 flex gap-4">
                <button type="button" className="interactive rounded-[18px] bg-[#0c56d0] px-7 py-4 text-[16px] font-bold text-white shadow-[0_12px_20px_rgba(12,86,208,0.14)]">Update</button>
                <button type="button" className="rounded-[18px] bg-[#f0edec] px-7 py-4 text-[16px] font-bold text-[#546067]">Download</button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] bg-[#0c56d0] p-8 text-white shadow-[0_14px_28px_rgba(12,86,208,0.18)]">
          <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-white/75">Trust Score</p>
          <h2 className="mt-5 text-[72px] font-extrabold leading-none tracking-[-0.08em]">85%</h2>
          <p className="mt-5 text-[16px] leading-8 text-white/85">Your profile is nearly verified. Complete your Passport Photo upload to reach 100%.</p>
          <div className="mt-12 h-2 rounded-full bg-white/25"><div className="h-2 w-[85%] rounded-full bg-white" /></div>
        </section>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8">
        <section className="rounded-[30px] border-2 border-dashed border-[#eeebea] bg-white p-8">
          <div className="flex items-start justify-between"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3f1f0] text-[#626b77]"><Icon name="add_a_photo" /></div><span className="rounded-full bg-[#fff2de] px-4 py-2 text-[12px] font-bold text-[#b7791f]">PENDING</span></div>
          <h3 className="mt-8 text-[30px] font-extrabold tracking-[-0.05em]">Passport Sized Photo</h3>
          <p className="mt-4 max-w-[520px] text-[16px] leading-8 text-[#546067]">Required for your physical dormitory access card. Please use a plain white background.</p>
          <div className="mt-12 flex items-center justify-between"><span className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#cad0d7]">No File Selected</span><button type="button" className="text-[18px] font-extrabold text-[#0c56d0]">Upload Now →</button></div>
        </section>

        <section className="rounded-[30px] bg-white p-8 ring-1 ring-[#efebea]">
          <div className="flex items-start justify-between"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f0ff] text-[#0c56d0]"><Icon name="school" /></div><span className="rounded-full bg-[#e9f6ed] px-4 py-2 text-[12px] font-bold text-[#24925e]">VERIFIED</span></div>
          <h3 className="mt-8 text-[30px] font-extrabold tracking-[-0.05em]">Admission Certificate</h3>
          <p className="mt-4 max-w-[520px] text-[16px] leading-8 text-[#546067]">Official university enrollment proof for the 2023–2024 academic year.</p>
          <div className="mt-12 flex items-center justify-between"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f3f1f0] font-bold text-[#7b818c]">PDF</div><div><p className="text-[16px] font-bold">cert_2024.pdf</p><p className="text-[14px] text-[#7b818c]">2.4 MB</p></div></div><button type="button" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f2f1]"><Icon name="download" /></button></div>
        </section>
      </div>

      <section className="mt-8 flex items-center justify-between rounded-[30px] bg-white p-8 ring-1 ring-[#efebea]">
        <div className="flex items-center gap-6"><div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#f3f7ff] text-[#0c56d0]"><Icon name="support_agent" className="text-[28px]" /></div><div><h3 className="text-[28px] font-extrabold tracking-[-0.05em]">Need help with document verification?</h3><p className="mt-3 max-w-[720px] text-[16px] leading-8 text-[#546067]">Our administrative team typically reviews all pending documents within 48 hours. If you have been rejected, please check the feedback and re-upload.</p></div></div>
        <button type="button" className="rounded-[20px] border-2 border-[#0c56d0] px-8 py-4 text-[16px] font-bold text-[#0c56d0]">Contact Registrar</button>
      </section>

      <footer className="mt-12 flex items-center justify-between text-[12px] uppercase tracking-[0.16em] text-[#bec6ce]"><div>THE ATELIER © 2024</div><div className="flex gap-8"><a href="#">Security Policy</a><a href="#">Compliance</a></div></footer>
    </PageFrame>
  )
}

function ReviewsPage() {
  const { token } = useAuth()
  const [dorms, setDorms] = useState([])
  const [rooms, setRooms] = useState([])
  const [myReviews, setMyReviews] = useState([])
  const [publishedReviews, setPublishedReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    dorm: '',
    room: '',
    overall: 4,
    cleanliness: 4,
    security: 4,
    internet: 4,
    maintenance: 4,
    comment: '',
    anonymous: false,
  })

  const isDemoUser = token === 'dormdoor_demo_token'
  const demoStorageKey = 'dormdoor_demo_student_reviews'

  const parseDemoReviews = (raw) => {
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const fetchMyReviews = async () => {
    if (isDemoUser) {
      const parsed = parseDemoReviews(localStorage.getItem(demoStorageKey))
      setMyReviews(parsed)
      return
    }

    const { data } = await api.get('/reviews/mine')
    setMyReviews(data.reviews || [])
  }

  const fetchPublishedReviews = async (dormId = '') => {
    const params = dormId ? { dormId } : {}
    const { data } = await api.get('/reviews', { params })
    setPublishedReviews(data.reviews || [])
  }

  useEffect(() => {
    async function bootstrap() {
      setLoading(true)
      setError('')

      try {
        const [{ data: dormData }] = await Promise.all([api.get('/dorms')])
        const dormList = dormData.dorms || []
        setDorms(dormList)

        await Promise.all([fetchMyReviews(), fetchPublishedReviews()])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load review data')
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [isDemoUser, token])

  useEffect(() => {
    async function loadRooms() {
      if (!form.dorm) {
        setRooms([])
        return
      }

      try {
        const { data } = await api.get('/rooms', { params: { dormId: form.dorm } })
        setRooms(data.rooms || [])
      } catch {
        setRooms([])
      }
    }

    loadRooms()
  }, [form.dorm])

  useEffect(() => {
    fetchPublishedReviews(form.dorm).catch(() => {
      setPublishedReviews([])
    })
  }, [form.dorm])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.dorm || !form.comment.trim()) {
      setError('Dorm and review comment are required')
      return
    }

    setSubmitting(true)
    setError('')
    setMessage('')

    const payload = {
      dorm: form.dorm,
      room: form.room || undefined,
      rating: {
        overall: Number(form.overall),
        cleanliness: Number(form.cleanliness),
        security: Number(form.security),
        internet: Number(form.internet),
        maintenance: Number(form.maintenance),
      },
      comment: form.comment.trim(),
      anonymous: form.anonymous,
      photos: [],
    }

    try {
      if (isDemoUser) {
        const dormName = dorms.find((dorm) => dorm._id === form.dorm)?.name || 'Demo Dorm'
        const roomName = rooms.find((room) => room._id === form.room)?.roomNumber || 'N/A'
        const created = {
          _id: `demo-review-${Date.now()}`,
          dorm: { name: dormName },
          room: { roomNumber: roomName },
          rating: payload.rating,
          comment: payload.comment,
          anonymous: payload.anonymous,
          status: 'Published',
          createdAt: new Date().toISOString(),
        }

        const next = [created, ...myReviews]
        setMyReviews(next)
        localStorage.setItem(demoStorageKey, JSON.stringify(next))
      } else {
        await api.post('/reviews', payload)
        await Promise.all([fetchMyReviews(), fetchPublishedReviews(form.dorm)])
      }

      setMessage('Review submitted successfully')
      setForm((prev) => ({
        ...prev,
        room: '',
        overall: 4,
        cleanliness: 4,
        security: 4,
        internet: 4,
        maintenance: 4,
        comment: '',
        anonymous: false,
      }))
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const averageOverall = useMemo(() => {
    if (!publishedReviews.length) return 0
    const total = publishedReviews.reduce((sum, item) => sum + (item.rating?.overall || 0), 0)
    return (total / publishedReviews.length).toFixed(1)
  }, [publishedReviews])

  const renderRatingField = (label, key) => (
    <label className="block text-[13px] font-semibold text-[#546067]">
      {label}
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        name={key}
        value={form[key]}
        onChange={handleChange}
        className="mt-2 w-full accent-[#0c56d0]"
      />
      <span className="text-[12px] text-[#0c56d0]">{form[key]}/5</span>
    </label>
  )

  return (
    <PageFrame placeholder="Search reviews...">
      <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#0c56d0]">Residential Feedback</p>
      <h1 className="mt-3 text-[48px] font-extrabold leading-none tracking-[-0.06em]">Share Your Experience</h1>
      <p className="mt-4 max-w-[880px] text-[16px] leading-8 text-[#546067]">
        Submit a room review and help other students make better housing decisions.
      </p>

      {loading ? <p className="mt-8 text-[16px] font-semibold text-[#546067]">Loading review tools...</p> : null}
      {error ? <p className="mt-6 rounded-xl bg-[#ffe9ec] px-4 py-3 text-sm font-semibold text-[#c73535]">{error}</p> : null}
      {message ? <p className="mt-6 rounded-xl bg-[#ecf7ef] px-4 py-3 text-sm font-semibold text-[#23945b]">{message}</p> : null}

      <div className="mt-10 grid grid-cols-[1.1fr_1fr] gap-8">
        <section className="rounded-[28px] bg-white p-8 ring-1 ring-[#efebea]">
          <h3 className="text-[24px] font-extrabold tracking-[-0.04em]">Submit Review</h3>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
                Dorm
                <select name="dorm" value={form.dorm} onChange={handleChange} className="mt-2 w-full rounded-xl border-none bg-[#f1ecea] px-4 py-3 text-sm" required>
                  <option value="">Select dorm</option>
                  {dorms.map((dorm) => (
                    <option key={dorm._id} value={dorm._id}>{dorm.name}</option>
                  ))}
                </select>
              </label>

              <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
                Room
                <select name="room" value={form.room} onChange={handleChange} className="mt-2 w-full rounded-xl border-none bg-[#f1ecea] px-4 py-3 text-sm">
                  <option value="">Optional</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>{room.roomNumber} - {room.type}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {renderRatingField('Overall', 'overall')}
              {renderRatingField('Cleanliness', 'cleanliness')}
              {renderRatingField('Security', 'security')}
              {renderRatingField('Internet', 'internet')}
              {renderRatingField('Maintenance', 'maintenance')}
            </div>

            <label className="block text-[13px] font-semibold text-[#546067]">
              Comment
              <textarea
                rows="5"
                name="comment"
                value={form.comment}
                onChange={handleChange}
                placeholder="Describe your real experience with this dorm and room"
                className="mt-2 w-full rounded-[18px] bg-[#f4f1f0] p-4 text-[15px] outline-none"
                required
              />
            </label>

            <label className="flex items-center gap-3 text-[15px] text-[#546067]">
              <input type="checkbox" name="anonymous" checked={form.anonymous} onChange={handleChange} className="h-5 w-5" />
              Post review anonymously
            </label>

            <button type="submit" disabled={submitting} className="rounded-[18px] bg-[#0c56d0] px-8 py-3 text-[16px] font-bold text-white disabled:opacity-70">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </section>

        <div className="space-y-6">
          <section className="rounded-[28px] bg-[#0c56d0] p-6 text-white shadow-[0_12px_24px_rgba(12,86,208,0.18)]">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/70">Published Reviews</p>
            <h3 className="mt-4 text-[42px] font-extrabold leading-none">{publishedReviews.length}</h3>
            <p className="mt-2 text-[15px] text-white/85">Average overall rating: {averageOverall || '0.0'}/5</p>
          </section>

          <section className="rounded-[28px] bg-white p-6 ring-1 ring-[#efebea]">
            <h3 className="text-[18px] font-extrabold">My Recent Reviews</h3>
            <div className="mt-4 space-y-4">
              {myReviews.length === 0 ? (
                <p className="text-[14px] text-[#6b7280]">You have not submitted any reviews yet.</p>
              ) : (
                myReviews.slice(0, 5).map((item) => (
                  <div key={item._id} className="rounded-[18px] bg-[#f7f4f3] p-4">
                    <p className="text-[15px] font-bold">{item.dorm?.name || 'Dorm'}</p>
                    <p className="mt-1 text-[13px] text-[#6b7280]">Overall: {item.rating?.overall || '-'} / 5</p>
                    <p className="mt-2 text-[14px] text-[#546067]">{item.comment}</p>
                    <p className="mt-2 text-[12px] font-semibold text-[#7b818c]">{item.status || 'Published'} � {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </PageFrame>
  )
}

function ProfilePage() {
  const info = [
    ['FULL NAME', 'Julian Alexander Thorne'],
    ['STUDENT ID', 'UA-2024-88421'],
    ['UNIVERSITY', 'Metropolitan University of Design'],
    ['DEPARTMENT', 'Faculty of Architecture & Urbanism'],
    ['GENDER', 'Male'],
    ['DATE OF BIRTH', 'October 12, 2001'],
  ]

  return (
    <PageFrame placeholder="Search services...">
      <h1 className="text-[36px] font-extrabold tracking-[-0.05em]">Student Profile</h1>

      <div className="mt-8 grid grid-cols-[340px_1fr] gap-8">
        <section className="card-hover rounded-[28px] bg-white p-8 ring-1 ring-[#efebea]">
          <div className="mx-auto h-2 w-full rounded-full bg-[#0c56d0]" />
          <div className="relative mt-8 text-center">
            <Avatar src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80" className="mx-auto h-36 w-36 ring-4 ring-[#f0edec]" />
            <button type="button" className="absolute right-[88px] top-[88px] flex h-12 w-12 items-center justify-center rounded-full bg-[#0c56d0] text-white"><Icon name="edit" /></button>
          </div>
          <h2 className="mt-8 text-center text-[34px] font-extrabold tracking-[-0.05em]">Julian Alexander</h2>
          <p className="mt-2 text-center text-[17px] text-[#546067]">Architecture Senior • Room 402-A</p>
          <div className="mt-5 flex justify-center gap-3"><span className="rounded-full bg-[#eef1f4] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#5f6772]">Active Resident</span><span className="rounded-full bg-[#e5f7e9] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#23945b]">Paid</span></div>
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#ece8e6] pt-6 text-center"><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7b818c]">Check-In</p><p className="mt-2 text-[20px] font-extrabold tracking-[-0.03em]">Sep 2023</p></div><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7b818c]">Contract End</p><p className="mt-2 text-[20px] font-extrabold tracking-[-0.03em]">Jun 2024</p></div></div>
        </section>

        <section className="card-hover rounded-[28px] bg-white p-8 ring-1 ring-[#efebea]">
          <div className="flex items-start justify-between"><div><h3 className="text-[34px] font-extrabold tracking-[-0.05em]">Personal Information</h3><p className="mt-2 text-[17px] text-[#546067]">Manage your academic and personal details.</p></div><button type="button" className="text-[17px] font-bold text-[#0c56d0]">Edit Info</button></div>
          <div className="mt-10 grid grid-cols-2 gap-x-16 gap-y-10">
            {info.map(([label, value]) => (
              <div key={label}><p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#cad0d7]">{label}</p><p className="mt-3 text-[22px] leading-[1.45] tracking-[-0.03em]">{value}</p></div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 grid grid-cols-[1.15fr_0.85fr] gap-8">
        <section className="rounded-[28px] bg-[#f0edec] p-8">
          <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0c56d0]"><Icon name="contact_page" /></div><h3 className="text-[26px] font-extrabold tracking-[-0.04em]">Contact Information</h3></div>
          <div className="mt-8 space-y-6">
            {[
              ['alternate_email', 'EMAIL ADDRESS', 'j.alexander@metrouniv.edu'],
              ['call', 'PHONE NUMBER', '+1 (555) 012–3456'],
              ['location_on', 'PRESENT ADDRESS', 'Room 402–A, The Academic Atelier, 12 University Ave, North District'],
            ].map(([icon, label, value]) => (
              <div key={label} className="flex gap-5 rounded-[22px] bg-white px-6 py-5"><Icon name={icon} className="mt-2 text-[24px] text-[#5f6772]" /><div><p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#7b818c]">{label}</p><p className="mt-2 text-[22px] leading-[1.45] tracking-[-0.03em]">{value}</p></div></div>
            ))}
          </div>
        </section>

        <div className="space-y-8">
          <section className="rounded-[28px] bg-[#f0edec] p-8"><div className="flex items-start justify-between"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7effa] text-[#0c56d0]"><Icon name="shield_lock" filled /></div><h3 className="text-[26px] font-extrabold tracking-[-0.04em]">Security</h3></div><span className="rounded-full bg-[#dff3e4] px-4 py-2 text-[12px] font-bold text-[#23945b]">SECURED</span></div><p className="mt-8 text-[16px] leading-8 text-[#546067]">Update your password or manage multi-factor authentication settings.</p><button type="button" className="mt-8 flex w-full items-center justify-between rounded-[18px] bg-white px-5 py-4 text-[17px] font-bold">Change Account Password<Icon name="chevron_right" className="text-[#7b818c]" /></button></section>
          <section className="card-hover rounded-[28px] bg-white p-8 ring-1 ring-[#efebea]"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3f6] text-[#46606d]"><Icon name="notifications_active" /></div><h3 className="text-[26px] font-extrabold tracking-[-0.04em]">Notification Preferences</h3></div><div className="mt-8 space-y-6">{[['Email Notifications', true], ['Push Notifications', true], ['SMS Alerts', false]].map(([label, on]) => <div key={label} className="flex items-center justify-between text-[17px]"><span>{label}</span><span className={`relative h-8 w-14 rounded-full ${on ? 'bg-[#0c56d0]' : 'bg-[#d7dbe2]'}`}><span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${on ? 'right-1' : 'left-1'}`} /></span></div>)}</div></section>
        </div>
      </div>

      <section className="mt-8 flex items-center justify-between rounded-[28px] bg-[#f0edec] px-8 py-8"><div><h3 className="text-[26px] font-extrabold tracking-[-0.04em]">Privacy &amp; Data</h3><p className="mt-2 text-[16px] text-[#546067]">Request a copy of your personal data or request account deletion.</p></div><div className="flex gap-5"><button type="button" className="rounded-[18px] border border-[#cad0d7] bg-white px-8 py-4 text-[16px] font-bold">Export Data</button><button type="button" className="rounded-[18px] bg-[#f9dede] px-8 py-4 text-[16px] font-bold text-[#c52424]">Deactivate Account</button></div></section>
    </PageFrame>
  )
}

function SupportPage() {
  const tickets = [
    ['#SR-9421', 'Leaking pipe in Room 402B', "Hi Admin, I noticed a leak under the bathroom sink this morning. It's starting to pool...", 'Elena Rodriguez', '2 min ago', 'urgent'],
    ['#SR-9418', 'WiFi signal strength issues', "My internet connection has been very unstable since the storm yesterday. I can't even...", 'Julian Chen', '1 hour ago', ''],
    ['#SR-9415', 'Guest request for Saturday', 'I would like to host a friend from another university this Saturday. What is the process for...', 'Amara Okafor', '4 hours ago', ''],
    ['#SR-9402', 'Gym card not working', 'Mark Thompson', 'Mark Thompson', 'Yesterday', 'resolved'],
  ]

  return (
    <PageFrame placeholder="Search support tickets...">
      <div className="grid grid-cols-[360px_1fr_320px] gap-0 overflow-hidden rounded-[30px] bg-white shadow-[0_6px_18px_rgba(0,0,0,0.04)] ring-1 ring-[#eeebea]">
        <section className="border-r border-[#efebea]">
          <div className="flex items-center justify-between px-6 py-6"><h2 className="text-[28px] font-extrabold tracking-[-0.05em]">Inbox</h2><span className="live-pill rounded-full bg-[#0c56d0] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white">12 New</span></div>
          <div className="flex gap-3 px-6 pb-5"><button className="interactive rounded-full bg-[#0c56d0] px-5 py-2 text-[14px] font-bold text-white">All Tickets</button><button className="rounded-full bg-[#f3efed] px-5 py-2 text-[14px] text-[#5f6772]">Pending</button><button className="rounded-full bg-[#f3efed] px-5 py-2 text-[14px] text-[#5f6772]">Resolved</button></div>
          <div>
            {tickets.map((t, i) => (
              <div key={t[0]} className={`border-t border-[#efebea] px-6 py-5 ${i === 0 ? 'border-l-4 border-l-[#0c56d0] bg-[#fff]' : 'bg-white'}`}>
                <div className="flex items-center justify-between"><p className="text-[14px] font-bold text-[#0c56d0]">{t[0]}</p><span className="text-[13px] text-[#7b818c]">{t[4]}</span></div>
                <h3 className="mt-3 text-[18px] font-extrabold tracking-[-0.04em]">{t[1]}</h3>
                <p className="mt-2 text-[14px] leading-7 text-[#546067]">{t[2]}</p>
                <div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-3"><Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" className="h-10 w-10" /><span className="text-[14px]">{t[3]}</span></div>{t[5] === 'urgent' ? <span className="rounded-full bg-[#fff2de] px-3 py-1 text-[11px] font-bold text-[#b7791f]">URGENT</span> : t[5] === 'resolved' ? <span className="rounded-full bg-[#eaf7ee] px-3 py-1 text-[11px] font-bold text-[#23945b]">RESOLVED</span> : null}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-r border-[#efebea] bg-[#fcfbfb]">
          <div className="flex items-center justify-between px-7 py-6"><div><h2 className="text-[22px] font-extrabold leading-tight tracking-[-0.04em]">Elena<br />Rodriguez</h2><p className="mt-1 text-[14px] text-[#7b818c]">Room 402B • Third Year<br />Architecture</p></div><div className="flex gap-3"><button className="rounded-2xl border border-[#e3dfdd] px-5 py-3 text-[14px] font-bold">View History</button><button className="rounded-2xl bg-[#10a56b] px-5 py-3 text-[14px] font-bold text-white">Mark Resolved</button></div></div>
          <p className="px-7 text-center text-[12px] font-bold uppercase tracking-[0.28em] text-[#94a3b8]">October 24, 2023</p>
          <div className="space-y-6 px-7 py-6">
            <div className="max-w-[360px] rounded-[24px] bg-[#f1eceb] p-5 text-[16px] leading-8 text-[#2f2f2f]">
              Hi Admin, I noticed a leak under the bathroom sink this morning. It's starting to pool on the floor and I'm worried it might damage my belongings or leak into the room below.
              <div className="mt-4 grid grid-cols-2 gap-3"><img className="h-24 w-full rounded-2xl object-cover" src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80" alt="leak" /><div className="flex h-24 items-center justify-center rounded-2xl bg-[#dfe5ea] text-[#7b818c]"><Icon name="image" className="text-[24px]" /></div></div>
            </div>
            <p className="text-[13px] text-[#7b818c]">09:12 AM</p>
            <div className="ml-auto max-w-[380px] rounded-[24px] border border-[#cfe0ff] bg-[#eaf2ff] p-5 text-[16px] leading-8 text-[#1f4cb7]">Hello Elena, thank you for bringing this to our attention. I've flagged this as urgent for the maintenance team. Is someone currently in the room to let them in, or should we use the master key?</div>
            <p className="text-right text-[13px] text-[#7b818c]">09:15 AM • Seen</p>
            <div className="max-w-[360px] rounded-[24px] bg-[#f1eceb] p-5 text-[16px] leading-8 text-[#2f2f2f]">I have a lecture in 10 minutes, so please use the master key. I've placed a towel under the leak for now. Thanks!</div>
            <p className="text-[13px] text-[#7b818c]">09:18 AM</p>
          </div>
          <div className="border-t border-[#efebea] p-6">
            <div className="rounded-[24px] bg-[#f5f2f1] p-5">
              <textarea rows="4" className="w-full resize-none bg-transparent text-[16px] outline-none placeholder:text-[#9aa3ae]" placeholder="Type your reply here..." />
              <div className="mt-4 flex items-end justify-between gap-4"><div className="flex gap-4 text-[#6b7280]"><Icon name="attach_file" /><Icon name="image" /><Icon name="sentiment_satisfied" /></div><button type="button" className="interactive rounded-[18px] bg-[#0c56d0] px-7 py-4 text-[16px] font-bold text-white shadow-[0_12px_20px_rgba(12,86,208,0.14)]">Send Message</button></div>
            </div>
          </div>
        </section>

        <aside className="bg-[#faf9f9] p-7">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#94a3b8]">Ticket Info</p>
            <div className="mt-5 space-y-5 text-[16px]"><div><p className="text-[14px] text-[#7b818c]">Status</p><p className="mt-2 font-bold text-[#1c1b1b]">● Active Response</p></div><div><p className="text-[14px] text-[#7b818c]">Assigned To</p><div className="mt-3 flex items-center gap-3"><Avatar src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" className="h-10 w-10" /><span className="font-bold">David Wilson (Maint.)</span></div></div></div>
          </div>

          <div className="mt-10">
            <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#94a3b8]">Resident Profile</p>
            <div className="mt-5 rounded-[24px] bg-white p-5 ring-1 ring-[#efebea] text-[14px]">
              <div className="space-y-4"><div className="flex justify-between"><span className="text-[#7b818c]">Major</span><span className="font-bold">Architecture</span></div><div className="flex justify-between"><span className="text-[#7b818c]">Floor</span><span className="font-bold">4th Floor (West)</span></div><div className="flex justify-between"><span className="text-[#7b818c]">Contract Type</span><span className="font-bold">Full Academic Year</span></div><div className="flex justify-between"><span className="text-[#7b818c]">Trust Score</span><span className="font-bold text-[#eab308]">★★★★☆</span></div></div>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#94a3b8]">Past Tickets</p>
            <div className="mt-5 space-y-4">{[['SEPT 12, 2023', 'Air conditioning noise issue'], ['AUG 28, 2023', 'Missing laundry bag']].map((p) => <div key={p[0]} className="rounded-[22px] bg-white p-5 ring-1 ring-[#efebea]"><p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">{p[0]}</p><h4 className="mt-3 text-[16px] font-bold">{p[1]}</h4><p className="mt-3 text-[13px] font-bold text-[#23945b]">RESOLVED</p></div>)}</div>
          </div>

          <div className="mt-10 rounded-[22px] border border-[#cfdcf5] bg-[#f4f8ff] p-5 text-center text-[14px] leading-7 text-[#315db3]">Maintenance team has been dispatched and is estimated to arrive in 15 mins.</div>
        </aside>
      </div>
    </PageFrame>
  )
}

export default function StudentPortal() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [activePage, setActivePage] = useState(pathToPage(location.pathname))

  useEffect(() => {
    setActivePage(pathToPage(location.pathname))
  }, [location.pathname])

  const handlePageChange = (key) => {
    const target = PAGE_TO_PATH[key] || PAGE_TO_PATH.dashboard
    setActivePage(key)
    if (location.pathname !== target) {
      navigate(target)
    }
  }

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  const page = useMemo(() => {
    switch (activePage) {
      case 'applications':
        return <RoomApplicationsPage />
      case 'maintenance':
        return <MaintenancePage />
      case 'documents':
        return <DocumentsPage />
      case 'reviews':
        return <ReviewsPage />
      case 'profile':
        return <ProfilePage />
      case 'support':
        return <SupportPage />
      default:
        return <DashboardPage setActivePage={handlePageChange} />
    }
  }, [activePage])

  return (
    <div>
      <Sidebar activePage={activePage} setActivePage={handlePageChange} onSignOut={handleSignOut} />
      {page}
    </div>
  )
}


