export function formatDate(value) {
  if (!value) return 'N/A'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'N/A'
  return parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

export function formatDateTime(value) {
  if (!value) return 'N/A'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'N/A'
  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function money(value) {
  const amount = Number(value || 0)
  return `BDT ${amount.toLocaleString()}`
}

export function referenceId(item) {
  return item?._id ? String(item._id).slice(-8).toUpperCase() : 'N/A'
}

export function roomDisplayStatus(status) {
  if (status === 'Open' || status === 'Limited') return 'Available'
  if (status === 'Full') return 'Booked'
  return status || 'Available'
}

export function studentNameFromApplication(application) {
  return application?.student?.name || application?.personalInfo?.fullName || 'Unknown Student'
}

export function studentEmailFromApplication(application) {
  return application?.student?.email || application?.personalInfo?.email || 'Not provided'
}
