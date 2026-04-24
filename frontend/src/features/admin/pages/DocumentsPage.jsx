import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import Icon from '../components/Icon'
import { topbarAvatars } from '../data/dashboardData'
import { api } from '../../../api/client'
import { toSafeExternalUrl } from '../../../utils/url'

const PREVIEW_PLACEHOLDER = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'

function StudentAvatar({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center rounded-lg bg-[#e5edf9] font-extrabold text-[#0c56d0] ${className}`}
    >
      S
    </div>
  )
}

function formatRelativeTime(value) {
  if (!value) return 'Just now'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Just now'

  const diffMs = Date.now() - parsed.getTime()
  const diffMinutes = Math.max(1, Math.round(diffMs / (60 * 1000)))
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.round(diffHours / 24)
  return `${diffDays}d ago`
}

function formatDateTime(value) {
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

function formatFileSize(value) {
  const bytes = Number(value) || 0
  if (bytes <= 0) return 'N/A'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImageUrl(url) {
  return /\.(png|jpg|jpeg|webp|gif|bmp|svg)$/i.test(String(url || ''))
}

function docBadge(status) {
  if (status === 'Verified') return { label: 'VERIFIED', color: 'text-primary bg-primary/10' }
  if (status === 'Pending') return { label: 'PENDING', color: 'text-amber-600 bg-amber-100' }
  if (status === 'Needs Update') return { label: 'RE-UPLOAD', color: 'text-[#b7791f] bg-[#fff2cf]' }
  return { label: 'REJECTED', color: 'text-red-700 bg-red-100' }
}

function docTone(status) {
  if (status === 'Verified') return 'bg-primary/10 text-primary'
  if (status === 'Needs Update') return 'bg-[#fff2cf] text-[#b7791f]'
  if (status === 'Rejected') return 'bg-red-100 text-red-700'
  return 'bg-secondary-container text-on-secondary-container'
}

function fileSourceLabel(document, safeFileUrl) {
  if (document.storageType === 'url' && safeFileUrl) return 'URL Submission'
  return 'Uploaded File'
}

function normalizeApplicants(documents = []) {
  const grouped = documents.reduce((acc, doc) => {
    const studentId = doc.student?._id || 'unknown'
    if (!acc[studentId]) {
      acc[studentId] = {
        id: studentId,
        name: doc.student?.name || 'Unknown Applicant',
        email: doc.student?.email || 'Not provided',
        recordId: doc.student?.studentId || studentId.slice(-8).toUpperCase(),
        documents: [],
      }
    }

    acc[studentId].documents.push(doc)
    return acc
  }, {})

  return Object.values(grouped)
    .map((applicant) => {
      const sortedDocuments = [...applicant.documents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      const pendingCount = sortedDocuments.filter((item) => item.status === 'Pending' || item.status === 'Needs Update').length

      return {
        ...applicant,
        applied: formatRelativeTime(sortedDocuments[0]?.createdAt),
        badge: pendingCount > 0 ? `${pendingCount} Pending` : 'Cleared',
        badgeColor: pendingCount > 0 ? 'text-error bg-error/10' : 'text-primary bg-primary/10',
        tags: [...new Set(sortedDocuments.map((item) => item.category || 'Other'))].slice(0, 3),
        documents: sortedDocuments,
      }
    })
    .sort((a, b) => new Date(b.documents[0]?.createdAt || 0) - new Date(a.documents[0]?.createdAt || 0))
}

function DocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [activeApplicantId, setActiveApplicantId] = useState('')
  const [activeDocumentId, setActiveDocumentId] = useState('')
  const [reviewNote, setReviewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestState, setRequestState] = useState('')
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    async function loadDocuments() {
      setLoading(true)
      setError('')

      try {
        const { data } = await api.get('/documents')
        const docs = data.documents || []
        setDocuments(docs)

        const normalized = normalizeApplicants(docs)
        const firstApplicantId = normalized[0]?.id || ''
        setActiveApplicantId(firstApplicantId)
        setActiveDocumentId(normalized[0]?.documents?.[0]?._id || '')
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load document queue')
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()
  }, [])

  const applicants = useMemo(() => normalizeApplicants(documents), [documents])
  const activeApplicant = useMemo(
    () => applicants.find((item) => item.id === activeApplicantId) || applicants[0] || null,
    [activeApplicantId, applicants],
  )

  const activeDocument = useMemo(() => {
    const fallback = activeApplicant?.documents?.[0] || null
    if (!activeApplicant) return null
    return activeApplicant.documents.find((item) => item._id === activeDocumentId) || fallback
  }, [activeApplicant, activeDocumentId])

  const pendingCount = useMemo(
    () => documents.filter((item) => item.status === 'Pending' || item.status === 'Needs Update').length,
    [documents],
  )

  const urgentCount = useMemo(
    () => documents.filter((item) => item.status === 'Needs Update').length,
    [documents],
  )

  const verifiedCount = useMemo(
    () => documents.filter((item) => item.status === 'Verified').length,
    [documents],
  )

  const handleApplicantSelect = (applicantId) => {
    setActiveApplicantId(applicantId)
    const selectedApplicant = applicants.find((item) => item.id === applicantId)
    const firstDocument = selectedApplicant?.documents?.[0]
    setActiveDocumentId(firstDocument?._id || '')
    setReviewNote(firstDocument?.reviewNote || '')
    setRequestState('')
  }

  const handleDocumentSelect = (document) => {
    setActiveDocumentId(document._id)
    setReviewNote(document.reviewNote || '')
    setRequestState('')
  }

  const handleReview = async (status) => {
    if (!activeDocument?._id) return
    if (activeDocument.status === status) {
      setRequestState(`Document is already ${status}.`)
      return
    }
    setReviewing(true)
    setRequestState('')

    try {
      const { data } = await api.patch(`/documents/${activeDocument._id}/review`, {
        status,
        reviewNote: reviewNote.trim(),
      })

      const updated = data.document
      setDocuments((prev) =>
        prev.map((item) => (
          item._id === updated._id
            ? {
                ...item,
                status: updated.status,
                reviewNote: updated.reviewNote,
                reviewedBy: updated.reviewedBy,
                updatedAt: updated.updatedAt || item.updatedAt,
              }
            : item
        )),
      )
      setReviewNote(updated.reviewNote || '')
      setRequestState(`Document marked as ${updated.status}.`)
    } catch (requestError) {
      setRequestState(requestError.response?.data?.message || 'Failed to update document status.')
    } finally {
      setReviewing(false)
    }
  }

  const selectedSafeUrl = toSafeExternalUrl(activeDocument?.fileUrl)
  const selectedPreviewImage = selectedSafeUrl && isImageUrl(selectedSafeUrl) ? selectedSafeUrl : PREVIEW_PLACEHOLDER

  return (
    <AdminLayout
      activeKey="documents"
      sidebarVariant="atelier"
      topbarProps={{
        searchPlaceholder: 'Search applicants...',
        profileName: 'Admin User',
        profileRole: 'Housing Authority',
        avatar: topbarAvatars.docAdmin,
      }}
      contentClassName="mx-auto w-full max-w-[1400px] p-4 md:p-6 lg:p-8"
    >
      <div className="space-y-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-primary">Verification Queue</span>
            <h2 className="text-4xl font-black tracking-tight text-on-surface md:text-5xl">Document Center</h2>
            <p className="mt-2 max-w-2xl text-sm text-secondary md:text-base">
              Review uploaded student documents and update approval decisions without leaving this screen.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-secondary-container px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-on-secondary-container">Pending</p>
              <p className="mt-1 text-2xl font-black text-primary">{loading ? '...' : pendingCount}</p>
            </div>
            <div className="rounded-xl bg-surface-container-high px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-on-secondary-container">Urgent</p>
              <p className="mt-1 text-2xl font-black text-error">{loading ? '...' : urgentCount}</p>
            </div>
            <div className="rounded-xl bg-primary/10 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">Verified</p>
              <p className="mt-1 text-2xl font-black text-primary">{loading ? '...' : verifiedCount}</p>
            </div>
          </div>
        </div>

        {error ? <p className="rounded-xl bg-[#ffe9ec] px-4 py-3 text-sm font-semibold text-[#c73535]">{error}</p> : null}

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-outline-variant/20 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-secondary">Applicants</h3>
              <span className="rounded-full bg-surface-container px-2.5 py-1 text-xs font-bold text-on-surface">
                {applicants.length}
              </span>
            </div>

            {loading ? (
              <div className="rounded-xl bg-surface-container-lowest p-4 text-sm text-secondary">Loading applicants...</div>
            ) : applicants.length === 0 ? (
              <div className="rounded-xl bg-surface-container-lowest p-4 text-sm text-secondary">No document submissions found.</div>
            ) : (
              <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1">
                {applicants.map((applicant) => {
                  const active = applicant.id === (activeApplicant?.id || '')
                  return (
                    <button
                      key={applicant.id}
                      type="button"
                      onClick={() => handleApplicantSelect(applicant.id)}
                      className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                        active
                          ? 'border-primary/40 bg-primary/[0.05] shadow-sm'
                          : 'border-transparent bg-surface-container-lowest hover:border-outline-variant/25'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <StudentAvatar className="h-11 w-11 text-sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p data-user-content="true" className="truncate text-sm font-bold text-on-surface">{applicant.name}</p>
                            <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${applicant.badgeColor}`}>
                              {applicant.badge}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-secondary">Updated {applicant.applied}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {applicant.tags.map((tag) => (
                              <span key={tag} className="rounded bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-on-secondary-container">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </aside>

          <section className="rounded-2xl border border-outline-variant/20 bg-white shadow-sm">
            {!activeApplicant || !activeDocument ? (
              <div className="flex min-h-[620px] items-center justify-center p-10 text-center text-sm text-secondary">
                No documents available for review yet.
              </div>
            ) : (
              <>
                <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/15 p-5 md:flex-row md:items-center md:p-6">
                  <div className="flex items-center gap-4">
                    <StudentAvatar className="h-14 w-14 rounded-xl text-lg ring-2 ring-surface" />
                    <div>
                      <p data-user-content="true" className="text-xl font-black tracking-tight text-on-surface">{activeApplicant.name}</p>
                      <p data-user-content="true" className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
                        {activeApplicant.recordId} • {activeApplicant.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
                    <Icon name="description" className="text-base" />
                    <span>{activeApplicant.documents.length} documents</span>
                  </div>
                </div>

                <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,1fr)] md:p-6">
                  <div>
                    <h4 className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-secondary">Submitted Files</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {activeApplicant.documents.map((document) => {
                        const badge = docBadge(document.status)
                        const safeFileUrl = toSafeExternalUrl(document.fileUrl)
                        const previewImage = safeFileUrl && isImageUrl(safeFileUrl) ? safeFileUrl : ''
                        const active = document._id === activeDocument._id

                        return (
                          <button
                            key={document._id}
                            type="button"
                            onClick={() => handleDocumentSelect(document)}
                            className={`rounded-xl border p-3 text-left transition ${
                              active
                                ? 'border-primary/40 bg-primary/[0.05] shadow-sm'
                                : 'border-outline-variant/20 hover:border-outline-variant/35'
                            }`}
                          >
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <span className="truncate text-xs font-black uppercase tracking-[0.12em] text-secondary">
                                {document.category || 'Other'}
                              </span>
                              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${badge.color}`}>
                                {badge.label}
                              </span>
                            </div>
                            <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-surface-container ring-1 ring-outline-variant/20">
                              {previewImage ? (
                                <img src={previewImage} alt={document.fileName} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                                    <Icon name="insert_drive_file" className="text-xl" />
                                  </div>
                                </div>
                              )}
                            </div>
                            <p className="truncate text-sm font-bold text-on-surface">{document.fileName}</p>
                            <p className="mt-1 text-xs text-secondary">
                              {document.mimeType || fileSourceLabel(document, safeFileUrl)} • {formatFileSize(document.sizeBytes)}
                            </p>
                            <p className="mt-1 text-xs text-secondary">Submitted {formatDateTime(document.createdAt)}</p>
                            {document.storageType === 'url' && safeFileUrl ? (
                              <a
                                href={safeFileUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(event) => event.stopPropagation()}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary underline"
                              >
                                <Icon name="open_in_new" className="text-sm" />
                                Open link
                              </a>
                            ) : (
                              <p className="mt-2 text-xs font-semibold text-[#1f4cb7]">Uploaded from student device</p>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#f8f6f5] p-5 ring-1 ring-outline-variant/20">
                    <h4 className="text-sm font-black uppercase tracking-[0.14em] text-secondary">Review Panel</h4>

                    <div className="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-outline-variant/20">
                      <div className="aspect-[4/3] overflow-hidden bg-surface-container">
                        <img src={selectedPreviewImage} alt={activeDocument.fileName} className="h-full w-full object-cover" />
                      </div>
                      <div className="space-y-2 p-4 text-sm">
                        <p><span className="font-bold">File:</span> {activeDocument.fileName}</p>
                        <p><span className="font-bold">Category:</span> {activeDocument.category || 'Other'}</p>
                        <p><span className="font-bold">Source:</span> {fileSourceLabel(activeDocument, selectedSafeUrl)}</p>
                        <p><span className="font-bold">Type:</span> {activeDocument.mimeType || 'N/A'}</p>
                        <p><span className="font-bold">Size:</span> {formatFileSize(activeDocument.sizeBytes)}</p>
                        <p><span className="font-bold">Submitted:</span> {formatDateTime(activeDocument.createdAt)}</p>
                        <span className={`inline-flex rounded px-2 py-1 text-[10px] font-bold ${docTone(activeDocument.status)}`}>
                          {activeDocument.status || 'Pending'}
                        </span>
                      </div>
                    </div>

                    <label className="mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-secondary">
                      Review Note
                      <textarea
                        rows={4}
                        value={reviewNote}
                        onChange={(event) => setReviewNote(event.target.value)}
                        placeholder="Add context for the student (optional)"
                        className="mt-2 w-full rounded-xl border border-outline-variant/25 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </label>

                    {requestState ? <p className="mt-3 text-xs font-semibold text-secondary">{requestState}</p> : null}

                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <button
                        type="button"
                        disabled={reviewing || activeDocument.status === 'Rejected'}
                        onClick={() => handleReview('Rejected')}
                        className="rounded-lg border border-outline-variant/30 px-3 py-2 text-sm font-bold text-secondary transition hover:bg-error/5 hover:text-error disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        {activeDocument.status === 'Rejected' ? 'Rejected' : 'Reject'}
                      </button>
                      <button
                        type="button"
                        disabled={reviewing || activeDocument.status === 'Needs Update'}
                        onClick={() => handleReview('Needs Update')}
                        className="rounded-lg border border-outline-variant/30 px-3 py-2 text-sm font-bold text-on-surface transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        {activeDocument.status === 'Needs Update' ? 'Requested' : 'Re-upload'}
                      </button>
                      <button
                        type="button"
                        disabled={reviewing || activeDocument.status === 'Verified'}
                        onClick={() => handleReview('Verified')}
                        className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        {reviewing ? 'Saving...' : activeDocument.status === 'Verified' ? 'Approved' : 'Approve'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}

export default DocumentsPage
