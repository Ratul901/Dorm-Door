import { useMemo, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import Icon from '../components/Icon'
import { applicants, topbarAvatars } from '../data/dashboardData'

function DocumentsPage() {
  const [activeApplicantId, setActiveApplicantId] = useState(1)
  const activeApplicant = useMemo(
    () => applicants.find((item) => item.id === activeApplicantId) || applicants[0],
    [activeApplicantId],
  )

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
      contentClassName="mx-auto max-w-7xl p-10"
    >
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-primary">Verification Queue</span>
          <h2 className="text-5xl font-black tracking-tighter text-on-surface">Document Center</h2>
          <p className="mt-3 max-w-md text-secondary">
            Reviewing 24 pending applications for the Fall 2024 semester across all residence halls.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col justify-center rounded-xl bg-secondary-container px-6 py-4">
            <span className="text-xs font-bold uppercase tracking-tight text-on-secondary-container">Pending Approval</span>
            <span className="text-2xl font-black text-primary">18</span>
          </div>
          <div className="flex flex-col justify-center rounded-xl bg-surface-container-high px-6 py-4">
            <span className="text-xs font-bold uppercase tracking-tight text-on-secondary-container">Urgent</span>
            <span className="text-2xl font-black text-error">03</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <h3 className="flex items-center gap-2 px-2 text-sm font-bold text-on-surface-variant">
            <Icon name="filter_list" className="text-sm" />
            RECENT SUBMISSIONS
          </h3>

          {applicants.map((applicant) => {
            const active = applicant.id === activeApplicantId
            return (
              <button
                key={applicant.id}
                onClick={() => setActiveApplicantId(applicant.id)}
                className={`group w-full rounded-xl p-5 text-left transition-all ${
                  active
                    ? 'border-l-4 border-primary bg-surface-container-lowest ring-1 ring-black/[0.03]'
                    : 'bg-surface hover:scale-[1.02] hover:bg-surface-container-lowest'
                }`}
              >
                <div className="flex items-start gap-4">
                  <img src={applicant.avatar} alt={applicant.name} className={`h-12 w-12 rounded-lg object-cover ${active ? '' : 'opacity-80'}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-bold text-on-surface">{applicant.name}</h4>
                      {applicant.badge && (
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${applicant.badgeColor}`}>
                          {applicant.badge}
                        </span>
                      )}
                    </div>
                    <p className="mb-3 text-xs text-secondary">Applied: {applicant.applied}</p>
                    <div className="flex flex-wrap gap-2">
                      {applicant.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-secondary-container px-2 py-1 text-[10px] font-bold text-on-secondary-container"
                        >
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

        <div className="lg:col-span-8">
          <div className="flex h-full min-h-[600px] flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/10 bg-white p-8">
              <div className="flex items-center gap-6">
                <img src={activeApplicant.largeAvatar} alt={activeApplicant.name} className="h-20 w-20 rounded-2xl object-cover ring-4 ring-surface shadow-md" />
                <div>
                  <h3 className="text-3xl font-black tracking-tight text-on-surface">{activeApplicant.name}</h3>
                  <p className="mt-1 flex flex-wrap items-center gap-4 text-sm text-secondary">
                    <span className="flex items-center gap-1">
                      <Icon name="school" className="text-xs" />
                      {activeApplicant.classOf}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="pin_drop" className="text-xs" />
                      {activeApplicant.type}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">ID: {activeApplicant.recordId}</span>
                <button className="mt-2 rounded-lg border border-outline-variant/20 p-2 transition-colors hover:bg-slate-100">
                  <Icon name="more_vert" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-surface-container-low p-8">
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                {activeApplicant.documents.map((document) => (
                  <div key={document.title} className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <h5 className="text-xs font-black uppercase tracking-widest text-secondary">{document.title}</h5>
                      <span className={`flex items-center gap-1 text-[10px] ${document.status === 'OCR VERIFIED' ? 'text-primary' : 'text-secondary'}`}>
                        {document.status === 'OCR VERIFIED' && <Icon name="verified" className="text-[12px]" />}
                        {document.status}
                      </span>
                    </div>
                    <div className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.05] shadow-xl shadow-slate-900/5">
                      <img src={document.image} alt={document.title} className="h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.02]" />
                      <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        {document.actions.map((action) => (
                          <button key={action} className="rounded-full bg-white/90 p-3 transition-colors hover:bg-white">
                            <Icon name={action} className="text-on-surface" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={`flex items-center gap-3 rounded-xl bg-white/50 p-4 ${document.title === 'Profile Photograph' ? 'border border-primary/20' : ''}`}>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${document.noteColor}`}>
                        <Icon name={document.noteIcon} />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${document.title === 'Profile Photograph' ? 'text-primary' : 'text-on-surface'}`}>
                          {document.noteTitle}
                        </p>
                        <p className="text-[10px] text-secondary">{document.noteText}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 border-t border-outline-variant/10 bg-white p-8 md:flex-row">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <p className="text-xs font-medium text-secondary">
                  Awaiting final decision by <span className="font-bold text-on-surface">Administrative Board</span>
                </p>
              </div>
              <div className="flex w-full gap-4 md:w-auto">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-outline-variant/30 px-6 py-3 text-sm font-bold text-secondary transition-all hover:bg-error/5 hover:text-error md:flex-none">
                  <Icon name="close" className="text-lg" />
                  Reject
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-outline-variant/30 px-6 py-3 text-sm font-bold text-on-surface transition-all hover:bg-slate-50 md:flex-none">
                  <Icon name="refresh" className="text-lg" />
                  Request Re-upload
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 md:flex-none">
                  <Icon name="check_circle" className="text-lg" />
                  Approve Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-12 right-12 hidden flex-col gap-3 opacity-20 xl:flex">
        <div className="flex items-center gap-2 rounded-full border border-white bg-secondary-container px-4 py-2 shadow-sm">
          <Icon name="lock" className="text-sm" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Secure 256-bit</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white bg-secondary-container px-4 py-2 shadow-sm">
          <Icon name="shield" className="text-sm" />
          <span className="text-[10px] font-bold uppercase tracking-widest">GDPR Compliant</span>
        </div>
      </div>
    </AdminLayout>
  )
}

export default DocumentsPage


