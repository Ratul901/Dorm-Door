import { useEffect, useMemo, useState } from 'react'
import { MdCheckCircle, MdPendingActions, MdSwapHoriz, MdCancel } from 'react-icons/md'
import AdminLayout from '../components/layout/AdminLayout'
import Icon from '../components/Icon'
import { topbarAvatars } from '../data/dashboardData'
import { api } from '../../../api/client'
import { decideSwapRequest, listSwapRequests } from '../../../api/swapRequests'

const STATUS_OPTIONS = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled']

function statusClass(status) {
  if (status === 'Pending') return 'bg-amber-50 text-amber-700 ring-amber-700/10'
  if (status === 'Approved') return 'bg-green-50 text-green-700 ring-green-700/10'
  if (status === 'Cancelled') return 'bg-slate-100 text-slate-700 ring-slate-700/10'
  return 'bg-red-50 text-red-700 ring-red-700/10'
}

function formatDateTime(value) {
  if (!value) return 'Not available'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Not available'
  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function roomTitle(room) {
  if (!room) return 'Room not available'
  return `${room.roomNumber || 'Room'} - ${room.type || 'Room type not set'}`
}

function availableSeats(room) {
  return Math.max(Number(room?.seatCount || 0) - Number(room?.occupiedSeats || 0), 0)
}

function SwapRequestsPage() {
  const [swapRequests, setSwapRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [rooms, setRooms] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [decisionStatus, setDecisionStatus] = useState('Approved')
  const [adminNote, setAdminNote] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadSwapRequests() {
    setLoading(true)
    setError('')

    try {
      const { data } = await listSwapRequests()
      setSwapRequests(data.swapRequests || [])
      const roomResponse = await api.get('/rooms')
      setRooms(roomResponse.data.rooms || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load swap requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSwapRequests()
  }, [])

  const filteredRequests = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return swapRequests.filter((request) => {
      const studentName = request.student?.name || request.application?.personalInfo?.fullName || ''
      const studentId = request.student?.studentId || request.student?._id || ''
      const dormName = request.currentRoom?.dorm?.name || request.requestedDorm?.name || request.requestedDormName || request.requestedRoom?.dorm?.name || ''
      const roomText = `${request.currentRoom?.roomNumber || ''} ${request.requestedRoom?.roomNumber || ''}`

      const matchesSearch =
        query === '' ||
        studentName.toLowerCase().includes(query) ||
        String(studentId).toLowerCase().includes(query) ||
        dormName.toLowerCase().includes(query) ||
        roomText.toLowerCase().includes(query)

      const matchesStatus = statusFilter === 'All' || request.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [swapRequests, searchTerm, statusFilter])

  const stats = useMemo(() => {
    const pending = swapRequests.filter((item) => item.status === 'Pending').length
    const approved = swapRequests.filter((item) => item.status === 'Approved').length
    const rejected = swapRequests.filter((item) => item.status === 'Rejected').length

    return [
      {
        icon: MdSwapHoriz,
        iconWrap: 'bg-blue-50 text-blue-700',
        label: 'Total Requests',
        value: String(swapRequests.length),
      },
      {
        icon: MdPendingActions,
        iconWrap: 'bg-amber-50 text-amber-700',
        label: 'Pending Review',
        value: String(pending),
      },
      {
        icon: MdCheckCircle,
        iconWrap: 'bg-green-50 text-green-700',
        label: 'Approved',
        value: String(approved),
      },
      {
        icon: MdCancel,
        iconWrap: 'bg-red-50 text-red-700',
        label: 'Rejected',
        value: String(rejected),
      },
    ]
  }, [swapRequests])

  const openDecision = (request) => {
    setSelectedRequest(request)
    setSelectedRoomId(request.requestedRoom?._id || '')
    setDecisionStatus('Approved')
    setAdminNote(request.adminNote || '')
    setMessage('')
    setError('')
  }

  const closeDecision = () => {
    setSelectedRequest(null)
    setSelectedRoomId('')
    setDecisionStatus('Approved')
    setAdminNote('')
  }

  const handleDecision = async () => {
    if (!selectedRequest) return

    if (decisionStatus === 'Rejected' && !adminNote.trim()) {
      setError('Admin note is required when rejecting a swap request.')
      return
    }

    if (decisionStatus === 'Approved' && !selectedRoomId) {
      setError('Choose an available room before approving this swap request.')
      return
    }

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const { data } = await decideSwapRequest(selectedRequest._id, {
        status: decisionStatus,
        adminNote,
        requestedRoom: selectedRoomId,
      })

      const updated = data.swapRequest
      setSwapRequests((prev) => prev.map((item) => (item._id === updated._id ? updated : item)))
      setSelectedRequest(updated)
      setMessage(data.message || 'Swap request updated successfully.')
      void loadSwapRequests()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to update swap request')
    } finally {
      setSaving(false)
    }
  }

  const assignableRooms = useMemo(() => {
    if (!selectedRequest) return []
    const requestedDormId = selectedRequest.requestedDorm?._id || selectedRequest.requestedDorm

    return rooms.filter((room) => {
      const hasSeat = Number(room.occupiedSeats || 0) < Number(room.seatCount || 0)
      const isUsable = room.status !== 'Maintenance'
      const matchesDorm = !requestedDormId || String(room.dorm?._id || room.dorm) === String(requestedDormId)
      return hasSeat && isUsable && matchesDorm
    })
  }, [rooms, selectedRequest])

  return (
    <AdminLayout
      activeKey="swapRequests"
      topbarProps={{
        searchPlaceholder: 'Search swap requests...',
        profileName: 'Admin Panel',
        profileRole: '',
        avatar: topbarAvatars.availabilityAdmin,
      }}
      contentClassName="p-8"
    >
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
            Resident Mobility
          </label>
          <h2 className="text-5xl font-extrabold leading-tight tracking-tight text-on-surface">
            Swap Requests
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-600">
            Review room change requests, verify live availability, and approve or reject student swaps.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSwapRequests}
          className="flex items-center gap-2 rounded-lg bg-surface-container-low px-6 py-3 font-bold text-primary transition-all hover:bg-surface-container-high"
        >
          <Icon name="refresh" />
          Refresh
        </button>
      </div>

      {error ? <p className="mb-6 rounded-xl bg-[#ffe9ec] px-4 py-3 text-sm font-semibold text-[#c73535]">{error}</p> : null}
      {message ? <p className="mb-6 rounded-xl bg-[#ecf7ef] px-4 py-3 text-sm font-semibold text-[#23945b]">{message}</p> : null}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((item) => {
          const StatIcon = item.icon
          return (
            <div key={item.label} className="rounded-2xl bg-white p-5 ring-1 ring-outline-variant/15">
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${item.iconWrap}`}>
                <StatIcon className="text-2xl" />
              </div>
              <p className="text-sm font-semibold text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">{item.value}</p>
            </div>
          )
        })}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-[1.6fr_1fr]">
        <label className="relative block">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by student, dorm, or room"
            className="w-full rounded-xl border border-outline-variant/20 bg-white px-4 py-3 pl-10 text-sm outline-none focus:border-primary"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-outline-variant/20 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="rounded-2xl bg-white p-6 text-sm font-semibold text-slate-600 ring-1 ring-outline-variant/15">
          Loading swap requests...
        </p>
      ) : filteredRequests.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-sm font-semibold text-slate-600 ring-1 ring-outline-variant/15">
          No swap requests found.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-outline-variant/15">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Current Room</th>
                <th className="px-5 py-4">Requested Dorm / Room</th>
                <th className="px-5 py-4">Availability</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((request) => (
                <tr key={request._id} className="align-top">
                  <td className="px-5 py-5">
                    <p className="font-extrabold text-slate-900">{request.student?.name || request.application?.personalInfo?.fullName || 'Student'}</p>
                    <p className="mt-1 text-xs text-slate-500">{request.student?.email || request.application?.personalInfo?.email || 'Email not available'}</p>
                  </td>
                  <td className="px-5 py-5">
                    <p className="font-bold text-slate-800">{roomTitle(request.currentRoom)}</p>
                    <p className="mt-1 text-xs text-slate-500">{request.currentRoom?.dorm?.name || 'Dorm not available'}</p>
                  </td>
                  <td className="px-5 py-5">
                    <p className="font-bold text-slate-800">
                      {request.requestedDorm?.name || request.requestedDormName || request.requestedRoom?.dorm?.name || 'Dorm typed by student'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{request.requestedRoom ? roomTitle(request.requestedRoom) : 'No exact room selected'}</p>
                    <p className="mt-1 text-xs text-slate-500">Submitted {formatDateTime(request.createdAt)}</p>
                  </td>
                  <td className="px-5 py-5">
                    <p className="font-bold text-slate-800">{availableSeats(request.requestedRoom)} seats</p>
                    <p className="mt-1 text-xs text-slate-500">{request.requestedRoom?.status || 'Status not set'}</p>
                  </td>
                  <td className="px-5 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClass(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <button
                      type="button"
                      onClick={() => openDecision(request)}
                      className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequest ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Swap Decision</p>
                <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                  {selectedRequest.student?.name || selectedRequest.application?.personalInfo?.fullName || 'Student'}
                </h3>
              </div>
              <button type="button" onClick={closeDecision} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">
                Close
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Current Room</p>
                <p className="mt-2 font-extrabold">{roomTitle(selectedRequest.currentRoom)}</p>
                <p className="mt-1 text-sm text-slate-600">{selectedRequest.currentRoom?.dorm?.name || 'Dorm not available'}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Requested Room</p>
                <p className="mt-2 font-extrabold">
                  {selectedRequest.requestedDorm?.name || selectedRequest.requestedDormName || selectedRequest.requestedRoom?.dorm?.name || 'Preferred dorm not specified'}
                </p>
                <p className="mt-1 text-sm text-blue-700">
                  {selectedRequest.requestedRoom ? `${roomTitle(selectedRequest.requestedRoom)} - ${availableSeats(selectedRequest.requestedRoom)} seats available now` : 'Admin must choose a room before approval'}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-[#f7f4f3] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Student Reason</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{selectedRequest.reason}</p>
            </div>

            {selectedRequest.status === 'Pending' ? (
              <div className="mt-6 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Decision
                  <select
                    value={decisionStatus}
                    onChange={(event) => setDecisionStatus(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-outline-variant/20 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                  </select>
                </label>

                {decisionStatus === 'Approved' ? (
                  <label className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    Assign Available Room
                    <select
                      value={selectedRoomId}
                      onChange={(event) => setSelectedRoomId(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-outline-variant/20 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                      required
                    >
                      <option value="">Choose room for approval</option>
                      {assignableRooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.dorm?.name || 'Dorm'} - {room.roomNumber || 'Room'} - {room.type || 'Room'} ({availableSeats(room)} seats)
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <label className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Admin Note {decisionStatus === 'Rejected' ? '(required)' : '(optional)'}
                  <textarea
                    rows="4"
                    value={adminNote}
                    onChange={(event) => setAdminNote(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-outline-variant/20 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                    placeholder="Add a note for the student."
                  />
                </label>

                <button
                  type="button"
                  onClick={handleDecision}
                  disabled={saving}
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-70"
                >
                  {saving ? 'Saving...' : 'Save Decision'}
                </button>
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-700">This request is already {selectedRequest.status.toLowerCase()}.</p>
                {selectedRequest.adminNote ? <p className="mt-2 text-sm text-slate-600">Admin note: {selectedRequest.adminNote}</p> : null}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}

export default SwapRequestsPage
