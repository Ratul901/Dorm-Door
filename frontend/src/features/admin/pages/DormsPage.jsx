import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bath,
  Building,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  DoorClosed,
  Download,
  Filter,
  PencilLine,
  Search,
  Snowflake,
  Trash2,
  Tv,
  WashingMachine,
  Wifi,
  Wrench,
} from 'lucide-react'
import AdminLayout from '../components/layout/AdminLayout'
import { topbarAvatars } from '../data/dashboardData'

const stats = [
  {
    title: 'Total Dorms',
    value: '12 Buildings',
    tag: 'Active',
    tagClass: 'text-emerald-600 bg-emerald-50',
    icon: Building,
    iconWrap: 'bg-blue-50 text-blue-700',
  },
  {
    title: 'Total Rooms',
    value: '482 Units',
    icon: DoorClosed,
    iconWrap: 'bg-indigo-50 text-indigo-700',
  },
  {
    title: 'Available Now',
    value: '54 Rooms',
    tag: '88% Occ.',
    tagClass: 'text-primary',
    icon: CheckCircle2,
    iconWrap: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Under Maintenance',
    value: '08 Rooms',
    icon: Wrench,
    iconWrap: 'bg-amber-50 text-amber-700',
  },
]

const roomRows = [
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBV1NdVHs21TFIs9DTN4RXaZn7jODbTNz0Ob4r0Bmv0sUcuhtS1BrQmffSHHXEW4vlOHuMxTOnfhRe9COly0TVuZyIYrlHc1n3I3w9X2gXyCwwbdJRnQKpaottbWPhyDMwkic8K48PvlTHGgI1JYPEKMSmqC0q6BPlTJMNkxaGUYy53bCd-hFJToY4eordHsz-uVJsA7sEIsZHN8pUJodk4c0gQ0BML4jbxIa75AXIUIarMVWwiD_yvYnUQbVG40fjMnYjB9kC_ijWR',
    dorm: 'The Grand Atelier',
    block: 'Block A',
    floor: 'Floor 4',
    room: 'Room 402-B',
    type: 'Studio Premium',
    facilities: [Wifi, Snowflake, Tv],
    price: 'BDT 12,500',
    priceValue: 12500,
    priceSub: 'per month',
    status: 'Available',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnyYhXSAOBjWoNrkjVB6JVoORXOjG_tdbAyqkbKfeaKwe-2HCl4GTaomz1NF-4cgNfTuh0X5fj89reZAX4RR6DUSvTka0fZWg72R91AvQCXAXtJB5FiSHqPnC12w3IiAU6S9D0wc2KT4YD5VnlQABaRnpcMb29mT378O8OQNbF2Ht7dG4sh3Xt6n4hBuiFE-4jgK3WGUgn-LLOAXcVurQSn4W3UpvygyBCIjN0mi73Toe2hyEokJ_aiXbLvTqRwoNv_GrYosWTLuqN',
    dorm: 'North Wing Sanctuary',
    block: 'Block C',
    floor: 'Floor 1',
    room: 'Room 112-A',
    type: 'Twin Shared',
    facilities: [Wifi, CookingPot],
    price: 'BDT 8,500',
    priceValue: 8500,
    priceSub: 'per month',
    status: 'Occupied',
    statusLabel: 'Occupied (Until Oct)',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCl3rb_VORWq7LmT0FZi0LwSAZTHUyHBirlqdnRU2g91KoFFiWtVCJxSfsjGRhc8JbY0IM58fVcAUwnNksOV7oWBwThuqg0ykqFH5Qa9MjmFKq2edD-39C4VCzO0_MYN-BVRls6DR8kvt01dyMSSOonrsc3m0NXukKHuJku8TacMB9pZjKuucZ_qEk1j_5-Tq-zFicSAdiulFwHTvdb23RvMIAGyuUIqRoqGDIfZIQ3wk-Wd12n2vwD0hvsQVqqGiwPSRuYv1XCfwWb',
    dorm: 'The Grand Atelier',
    block: 'Block A',
    floor: 'Floor 2',
    room: 'Room 205-C',
    type: 'Triple Shared',
    facilities: [Wifi, WashingMachine],
    price: 'BDT 6,500',
    priceValue: 6500,
    priceSub: 'per month',
    status: 'Maintenance',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzjhkvFwsNQ0NkAkOX7yK4sZ4t0B-rCRObE71ksB3AovgjuE1RqSBj4c8DDeSXtHMwkHa_ZV6LRR-Ba0xIfHtT03e1a3Jl5Io23ecFOlBPnjwE3Gj7-iAWbjFC-9ymtNVa3vyAZ_d2bLb9ePgrHtYlKF41LHY9tv4rPSTBAXe-TTnE52AqWqAV3Oh_alZfI_xOttknrTHTo25mttYRi_Us-7wK6mtjS8VHVtwD8SIqivIWST2tJWg2ejsZ_xoR3zZdnfUObM4JxUbk',
    dorm: 'Skyline Suites',
    block: 'Block D',
    floor: 'Floor 12',
    room: 'Suite 1201',
    type: 'Executive Suite',
    facilities: [Wifi, Snowflake, Tv, Bath],
    price: 'BDT 21,000',
    priceValue: 21000,
    priceSub: 'per month',
    status: 'Available',
  },
]

function getStatusStyle(status) {
  if (status === 'Available') {
    return {
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700 ring-emerald-700/10',
    }
  }

  if (status === 'Maintenance') {
    return {
      dot: 'bg-slate-500',
      badge: 'bg-slate-100 text-slate-700 ring-slate-700/10',
    }
  }

  return {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 ring-amber-700/10',
  }
}

function DormsPage() {
  const [query, setQuery] = useState('')
  const [inventoryView, setInventoryView] = useState('all')
  const [selectedBlock, setSelectedBlock] = useState('All Blocks')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [sortBy, setSortBy] = useState('dorm')

  const blockOptions = useMemo(() => {
    return ['All Blocks', ...new Set(roomRows.map((row) => row.block))]
  }, [])

  const filteredRows = useMemo(() => {
    const search = query.trim().toLowerCase()
    const statusPriority = {
      Available: 0,
      Occupied: 1,
      Maintenance: 2,
    }

    let rows = roomRows.filter((row) => {
      const matchesSearch =
        search === '' ||
        row.dorm.toLowerCase().includes(search) ||
        row.room.toLowerCase().includes(search) ||
        row.type.toLowerCase().includes(search) ||
        row.block.toLowerCase().includes(search)

      const matchesView =
        inventoryView === 'all' ||
        (inventoryView === 'maintenance' && row.status === 'Maintenance') ||
        inventoryView === 'block'

      const matchesBlock =
        selectedBlock === 'All Blocks' || row.block === selectedBlock

      const matchesStatus =
        selectedStatus === 'All Statuses' || row.status === selectedStatus

      return matchesSearch && matchesView && matchesBlock && matchesStatus
    })

    rows = [...rows].sort((a, b) => {
      if (sortBy === 'price-high') return b.priceValue - a.priceValue
      if (sortBy === 'price-low') return a.priceValue - b.priceValue
      if (sortBy === 'room') return a.room.localeCompare(b.room)
      if (sortBy === 'status') return statusPriority[a.status] - statusPriority[b.status]
      return a.dorm.localeCompare(b.dorm)
    })

    return rows
  }, [inventoryView, query, selectedBlock, selectedStatus, sortBy])

  const resetFilters = () => {
    setQuery('')
    setInventoryView('all')
    setSelectedBlock('All Blocks')
    setSelectedStatus('All Statuses')
    setSortBy('dorm')
  }

  return (
    <AdminLayout
      activeKey="dorms"
      topbarProps={{
        searchPlaceholder: 'Search dorms or room numbers...',
        profileName: 'Alex Sterling',
        profileRole: 'Admin Head',
        avatar: topbarAvatars.admin,
      }}
      contentClassName="p-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-secondary">
              Inventory Management
            </p>
            <h2 className="text-3xl font-bold tracking-tight">Manage Dorms and Rooms</h2>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/dorms/add"
              className="flex items-center gap-2 rounded-lg border border-[#ece7e4] bg-white px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-[#f6f3f2]"
            >
              <Building2 size={18} /> Add Dorm
            </Link>
            <Link
              to="/admin/rooms/add"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:brightness-110"
            >
              <span className="text-lg leading-none">+</span> Add Room
            </Link>
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4">
          {stats.map((stat) => {
            const StatIcon = stat.icon
            return (
              <div key={stat.title} className="rounded-xl border border-[#ece7e4] bg-white p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className={`rounded-lg p-2 ${stat.iconWrap}`}>
                    <StatIcon size={18} />
                  </div>
                  {stat.tag ? (
                    <span className={`rounded px-2 py-1 text-xs font-bold ${stat.tagClass}`}>
                      {stat.tag}
                    </span>
                  ) : null}
                </div>
                <p className="mb-1 text-sm text-secondary">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            )
          })}
        </div>

        <div className="overflow-hidden rounded-[1.25rem] border border-[#ece7e4] bg-white shadow-sm">
          <div className="flex flex-col items-center justify-between gap-4 border-b border-[#f0ebea] p-6 md:flex-row">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setInventoryView('all')}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  inventoryView === 'all'
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:bg-[#f2efee]'
                }`}
              >
                All Inventory
              </button>
              <button
                type="button"
                onClick={() => setInventoryView('block')}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  inventoryView === 'block'
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:bg-[#f2efee]'
                }`}
              >
                By Block
              </button>
              <button
                type="button"
                onClick={() => setInventoryView('maintenance')}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  inventoryView === 'maintenance'
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:bg-[#f2efee]'
                }`}
              >
                Maintenance Needed
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-secondary"
              >
                <Filter size={16} /> Reset Filters
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-secondary">
                <Download size={16} /> Export CSV
              </button>
            </div>
          </div>

          <div className="grid gap-3 border-b border-[#f0ebea] p-6 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
            <label className="relative block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                <Search size={16} />
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search dorm, room, type, or block"
                className="w-full rounded-lg border border-[#ece7e4] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
              />
            </label>

            <select
              value={selectedBlock}
              onChange={(event) => setSelectedBlock(event.target.value)}
              className="rounded-lg border border-[#ece7e4] bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
            >
              {blockOptions.map((block) => (
                <option key={block} value={block}>
                  {block}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-lg border border-[#ece7e4] bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
            >
              {['All Statuses', 'Available', 'Occupied', 'Maintenance'].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-lg border border-[#ece7e4] bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="dorm">Sort: Dorm Name</option>
              <option value="room">Sort: Room Number</option>
              <option value="status">Sort: Availability</option>
              <option value="price-low">Sort: Price Low to High</option>
              <option value="price-high">Sort: Price High to Low</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-[#faf7f6]">
                <tr>
                  {['Dorm Name and Block', 'Room Details', 'Facilities', 'Pricing', 'Availability', 'Actions'].map(
                    (head) => (
                      <th
                        key={head}
                        className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.18em] text-secondary"
                      >
                        {head}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr className="border-t border-[#f0ebea]">
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-secondary">
                      No rooms match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => {
                    const statusStyle = getStatusStyle(row.status)
                    return (
                      <tr key={row.room} className="border-t border-[#f0ebea]">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <img src={row.image} alt={row.dorm} className="h-14 w-14 rounded-xl object-cover" />
                            <div>
                              <p className="text-[16px] font-bold leading-6">{row.dorm}</p>
                              <p className="text-sm text-secondary">
                                {row.block} - {row.floor}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-semibold">{row.room}</p>
                          <span className="mt-2 inline-block rounded-md bg-[#dce6ef] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary">
                            {row.type}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {row.facilities.map((Facility, index) => (
                              <span key={index} className="rounded-md bg-[#f2efee] p-2 text-secondary">
                                <Facility size={16} />
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-[16px] font-bold">{row.price}</p>
                          <p className="text-xs text-secondary">{row.priceSub}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-semibold ring-1 ${statusStyle.badge}`}
                          >
                            <span className={`h-2.5 w-2.5 rounded-full ${statusStyle.dot}`} />
                            {row.statusLabel || row.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <button className="rounded-lg p-2 text-primary hover:bg-blue-50">
                              <PencilLine size={16} />
                            </button>
                            <button className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-5 text-sm text-secondary">
            <p>
              Showing {filteredRows.length} of {roomRows.length} rooms
            </p>
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-2 hover:bg-[#f2efee]">
                <ChevronLeft size={16} />
              </button>
              <button className="rounded-lg bg-primary px-3 py-2 text-white">1</button>
              <button className="rounded-lg px-3 py-2 hover:bg-[#f2efee]">2</button>
              <button className="rounded-lg px-3 py-2 hover:bg-[#f2efee]">3</button>
              <button className="rounded-lg p-2 hover:bg-[#f2efee]">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="overflow-hidden rounded-[2rem] bg-primary px-10 py-10 text-white lg:col-span-8">
            <h3 className="max-w-xl text-5xl font-black leading-tight">
              Maximize your capacity with Smart Allocation.
            </h3>
            <p className="mt-5 max-w-2xl text-lg text-white/85">
              Our AI-driven system suggests optimal room pricing based on market trends and campus demand.
              Update your rates in one click.
            </p>
            <button className="mt-8 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-primary">
              Launch Price Optimizer
            </button>
          </div>
          <div className="rounded-[2rem] bg-[#f2efee] p-8 lg:col-span-4">
            <h4 className="mb-6 text-[18px] font-extrabold">Quick Snapshot</h4>
            <ul className="space-y-6 text-secondary">
              <li>
                <span className="block font-semibold text-[#1c1b1b]">Block A Renovation</span>
                Completion scheduled for Sept 15, 2024.
              </li>
              <li>
                <span className="block font-semibold text-[#1c1b1b]">High Demand Alert</span>
                Premium Studios in Block D are 100% booked.
              </li>
              <li>
                <span className="block font-semibold text-[#1c1b1b]">Policy Update</span>
                New utility billing cycle starting next month.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default DormsPage
