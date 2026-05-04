import { useEffect, useMemo, useState } from 'react'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import DataTable from '../../components/superAdmin/DataTable'
import SimpleModal from '../../components/superAdmin/SimpleModal'
import StatusBadge from '../../components/superAdmin/StatusBadge'
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout'
import { createRoom, deleteRoom, getDorms, getRooms, updateRoom } from '../../services/superAdminApi'
import { money, roomDisplayStatus } from './pageUtils'

const initialForm = {
  dorm: '',
  roomNumber: '',
  type: 'Single Room',
  floor: 'Ground Floor',
  seatCount: 1,
  availableSeats: 1,
  price: 0,
  status: 'Available',
}

const roomTypes = ['Single Room', 'Double Room', 'Shared (4 Bed)', 'Studio Suite', 'Premium Studio']
const roomStatuses = ['Available', 'Booked', 'Unavailable', 'Maintenance']

function RoomManagement() {
  const [rooms, setRooms] = useState([])
  const [dorms, setDorms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [modalMode, setModalMode] = useState('')
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const [{ data: roomData }, { data: dormData }] = await Promise.all([getRooms(), getDorms()])
      setRooms(roomData.rooms || [])
      setDorms(dormData.dorms || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load rooms')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openAdd = () => {
    setSelectedRoom(null)
    setForm(initialForm)
    setModalMode('form')
  }

  const openEdit = (room) => {
    const seatCount = Number(room.seatCount || 1)
    const occupiedSeats = Number(room.occupiedSeats || 0)
    setSelectedRoom(room)
    setForm({
      dorm: room.dorm?._id || room.dorm || '',
      roomNumber: room.roomNumber || '',
      type: room.type || 'Single Room',
      floor: room.floor || 'Ground Floor',
      seatCount,
      availableSeats: Math.max(0, seatCount - occupiedSeats),
      price: room.priceMonthly || 0,
      status: roomDisplayStatus(room.status),
    })
    setModalMode('form')
  }

  const openView = (room) => {
    setSelectedRoom(room)
    setModalMode('view')
  }

  const closeModal = () => {
    setSelectedRoom(null)
    setModalMode('')
    setForm(initialForm)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'seatCount') {
        const seatCount = Math.max(1, Number(value || 1))
        next.availableSeats = Math.min(Number(prev.availableSeats || 0), seatCount)
      }
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      if (selectedRoom?._id) {
        await updateRoom(selectedRoom._id, form)
        setMessage('Room updated successfully.')
      } else {
        await createRoom(form)
        setMessage('Room added successfully.')
      }
      await loadData()
      closeModal()
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Failed to save room.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (room) => {
    if (!window.confirm(`Delete room ${room.roomNumber}?`)) return

    try {
      await deleteRoom(room._id)
      await loadData()
      setMessage('Room deleted successfully.')
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Failed to delete room.')
    }
  }

  const updateStatus = async (room) => {
    const current = roomDisplayStatus(room.status)
    const next = window.prompt('Enter status: Available, Booked, Unavailable, or Maintenance', current)
    if (!next) return
    try {
      await updateRoom(room._id, { status: next })
      await loadData()
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Failed to update room status.')
    }
  }

  const columns = useMemo(
    () => [
      { key: 'dorm', label: 'Dorm Name', render: (row) => row.dorm?.name || 'N/A' },
      { key: 'roomNumber', label: 'Room Number' },
      { key: 'type', label: 'Room Type' },
      { key: 'floor', label: 'Floor' },
      { key: 'seatCount', label: 'Seat Count' },
      { key: 'availableSeats', label: 'Available Seats', render: (row) => Math.max(0, Number(row.seatCount || 0) - Number(row.occupiedSeats || 0)) },
      { key: 'price', label: 'Price', render: (row) => money(row.priceMonthly) },
      { key: 'status', label: 'Status', render: (row) => <StatusBadge status={roomDisplayStatus(row.status)} /> },
      {
        key: 'actions',
        label: 'Actions',
        render: (row) => (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => openView(row)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="View">
              <Eye size={16} />
            </button>
            <button type="button" onClick={() => openEdit(row)} className="rounded-lg p-2 text-primary hover:bg-blue-50" title="Edit">
              <Pencil size={16} />
            </button>
            <button type="button" onClick={() => updateStatus(row)} className="rounded-lg px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50">
              Status
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
    <SuperAdminLayout title="Rooms" subtitle="Manage room inventory, pricing, seats, and availability.">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h3 className="text-xl font-black text-slate-950">Room Management</h3>
          <p className="mt-1 text-sm text-slate-500">Total rooms: {rooms.length}</p>
        </div>
        <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white">
          <Plus size={17} /> Add Room
        </button>
      </div>

      {error ? <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {message ? <p className="mb-5 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">{message}</p> : null}

      <DataTable columns={columns} rows={rooms} loading={loading} emptyMessage="No rooms found." />

      {modalMode === 'form' ? (
        <SimpleModal title={selectedRoom ? 'Edit Room' : 'Add Room'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-slate-600">
              Dorm
              <select name="dorm" value={form.dorm} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required>
                <option value="">Select dorm</option>
                {dorms.map((dorm) => <option key={dorm._id} value={dorm._id}>{dorm.name}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600">
              Room number
              <input name="roomNumber" value={form.roomNumber} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required />
            </label>
            <label className="text-sm font-bold text-slate-600">
              Room type
              <select name="type" value={form.type} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
                {roomTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600">
              Floor
              <input name="floor" value={form.floor} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm font-bold text-slate-600">
              Seat count
              <input name="seatCount" type="number" min="1" value={form.seatCount} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm font-bold text-slate-600">
              Available seats
              <input name="availableSeats" type="number" min="0" max={form.seatCount} value={form.availableSeats} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm font-bold text-slate-600">
              Price
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm font-bold text-slate-600">
              Status
              <select name="status" value={form.status} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
                {roomStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button type="button" onClick={closeModal} className="rounded-lg px-4 py-2 font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" disabled={saving} className="rounded-lg bg-primary px-5 py-2 font-bold text-white disabled:opacity-70">
                {saving ? 'Saving...' : 'Save Room'}
              </button>
            </div>
          </form>
        </SimpleModal>
      ) : null}

      {modalMode === 'view' && selectedRoom ? (
        <SimpleModal title="Room Details" onClose={closeModal}>
          <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
            <p><strong>Dorm:</strong> {selectedRoom.dorm?.name || 'N/A'}</p>
            <p><strong>Room:</strong> {selectedRoom.roomNumber}</p>
            <p><strong>Type:</strong> {selectedRoom.type}</p>
            <p><strong>Floor:</strong> {selectedRoom.floor}</p>
            <p><strong>Seats:</strong> {selectedRoom.seatCount}</p>
            <p><strong>Available:</strong> {Math.max(0, Number(selectedRoom.seatCount || 0) - Number(selectedRoom.occupiedSeats || 0))}</p>
            <p><strong>Price:</strong> {money(selectedRoom.priceMonthly)}</p>
            <p><strong>Status:</strong> {roomDisplayStatus(selectedRoom.status)}</p>
          </div>
        </SimpleModal>
      ) : null}
    </SuperAdminLayout>
  )
}

export default RoomManagement
