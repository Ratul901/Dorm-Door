import { useEffect, useMemo, useState } from 'react'
import { Eye, Pencil, Plus, Power, Trash2 } from 'lucide-react'
import DataTable from '../../components/superAdmin/DataTable'
import SimpleModal from '../../components/superAdmin/SimpleModal'
import StatusBadge from '../../components/superAdmin/StatusBadge'
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout'
import {
  createDorm,
  deleteDorm,
  getDormAdmins,
  getDorms,
  updateDorm,
  updateDormStatus,
} from '../../services/superAdminApi'

const initialForm = {
  name: '',
  address: '',
  block: '',
  description: '',
  facilities: '',
  rules: '',
  priceRange: '',
  status: 'active',
  managedBy: '',
}

function DormManagement() {
  const [dorms, setDorms] = useState([])
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [modalMode, setModalMode] = useState('')
  const [selectedDorm, setSelectedDorm] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const [{ data: dormData }, { data: adminData }] = await Promise.all([getDorms(), getDormAdmins()])
      setDorms(dormData.dorms || [])
      setAdmins(adminData.dormAdmins || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load dorms')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openAdd = () => {
    setForm(initialForm)
    setSelectedDorm(null)
    setModalMode('form')
    setMessage('')
  }

  const openEdit = (dorm) => {
    setSelectedDorm(dorm)
    setForm({
      name: dorm.name || '',
      address: dorm.address || dorm.location || '',
      block: dorm.block || '',
      description: dorm.description || '',
      facilities: (dorm.facilities || []).join(', '),
      rules: dorm.rules || '',
      priceRange: dorm.priceRange || '',
      status: dorm.status || 'active',
      managedBy: dorm.managedBy?._id || dorm.assignedAdmin?._id || '',
    })
    setModalMode('form')
    setMessage('')
  }

  const openView = (dorm) => {
    setSelectedDorm(dorm)
    setModalMode('view')
  }

  const closeModal = () => {
    setModalMode('')
    setSelectedDorm(null)
    setForm(initialForm)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      if (selectedDorm?._id) {
        await updateDorm(selectedDorm._id, form)
        setMessage('Dorm updated successfully.')
      } else {
        await createDorm(form)
        setMessage('Dorm added successfully.')
      }

      await loadData()
      closeModal()
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Failed to save dorm.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (dorm) => {
    if (!window.confirm(`Delete ${dorm.name}? Dorms with rooms cannot be deleted.`)) return
    setMessage('')

    try {
      await deleteDorm(dorm._id)
      await loadData()
      setMessage('Dorm deleted successfully.')
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Failed to delete dorm.')
    }
  }

  const handleStatusToggle = async (dorm) => {
    const nextStatus = dorm.status === 'active' ? 'inactive' : 'active'

    try {
      await updateDormStatus(dorm._id, nextStatus)
      await loadData()
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Failed to update dorm status.')
    }
  }

  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Dorm Name',
        render: (row) => (
          <div>
            <p className="font-black text-slate-950">{row.name}</p>
            <p className="text-xs text-slate-500">{row.block || 'General'}</p>
          </div>
        ),
      },
      { key: 'location', label: 'Location', render: (row) => row.address || row.location || 'N/A' },
      { key: 'priceRange', label: 'Price Range', render: (row) => row.priceRange || 'N/A' },
      { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status === 'active' ? 'Active' : 'Inactive'} /> },
      {
        key: 'assignedAdmin',
        label: 'Assigned Admin',
        render: (row) => row.managedBy?.name || row.assignedAdmin?.name || 'Unassigned',
      },
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
            <button type="button" onClick={() => handleStatusToggle(row)} className="rounded-lg p-2 text-amber-700 hover:bg-amber-50" title="Activate or deactivate">
              <Power size={16} />
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
    <SuperAdminLayout title="Dorms" subtitle="Add, edit, assign, activate, and remove dorm records.">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h3 className="text-xl font-black text-slate-950">Dorm Management</h3>
          <p className="mt-1 text-sm text-slate-500">Total dorms: {dorms.length}</p>
        </div>
        <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white">
          <Plus size={17} /> Add Dorm
        </button>
      </div>

      {error ? <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {message ? <p className="mb-5 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">{message}</p> : null}

      <DataTable columns={columns} rows={dorms} loading={loading} emptyMessage="No dorms found." />

      {modalMode === 'form' ? (
        <SimpleModal title={selectedDorm ? 'Edit Dorm' : 'Add Dorm'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-slate-600">
              Dorm name
              <input name="name" value={form.name} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required />
            </label>
            <label className="text-sm font-bold text-slate-600">
              Location
              <input name="address" value={form.address} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required />
            </label>
            <label className="text-sm font-bold text-slate-600">
              Block
              <input name="block" value={form.block} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm font-bold text-slate-600">
              Price range
              <input name="priceRange" value={form.priceRange} onChange={handleChange} placeholder="BDT 5,000 - 10,000" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm font-bold text-slate-600">
              Status
              <select name="status" value={form.status} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600">
              Assigned admin
              <select name="managedBy" value={form.managedBy} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
                <option value="">Unassigned</option>
                {admins.map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600 sm:col-span-2">
              Facilities
              <input name="facilities" value={form.facilities} onChange={handleChange} placeholder="Wi-Fi, Dining, Laundry" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm font-bold text-slate-600 sm:col-span-2">
              Description
              <textarea name="description" rows="3" value={form.description} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm font-bold text-slate-600 sm:col-span-2">
              Rules
              <textarea name="rules" rows="3" value={form.rules} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button type="button" onClick={closeModal} className="rounded-lg px-4 py-2 font-bold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="rounded-lg bg-primary px-5 py-2 font-bold text-white disabled:opacity-70">
                {saving ? 'Saving...' : 'Save Dorm'}
              </button>
            </div>
          </form>
        </SimpleModal>
      ) : null}

      {modalMode === 'view' && selectedDorm ? (
        <SimpleModal title="Dorm Details" onClose={closeModal}>
          <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
            <p><strong>Name:</strong> {selectedDorm.name}</p>
            <p><strong>Location:</strong> {selectedDorm.address || selectedDorm.location}</p>
            <p><strong>Price Range:</strong> {selectedDorm.priceRange || 'N/A'}</p>
            <p><strong>Assigned Admin:</strong> {selectedDorm.managedBy?.name || 'Unassigned'}</p>
            <p className="sm:col-span-2"><strong>Facilities:</strong> {(selectedDorm.facilities || []).join(', ') || 'N/A'}</p>
            <p className="sm:col-span-2"><strong>Description:</strong> {selectedDorm.description || 'N/A'}</p>
            <p className="sm:col-span-2"><strong>Rules:</strong> {selectedDorm.rules || 'N/A'}</p>
          </div>
        </SimpleModal>
      ) : null}
    </SuperAdminLayout>
  )
}

export default DormManagement
