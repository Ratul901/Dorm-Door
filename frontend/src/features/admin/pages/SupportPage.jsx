import { useMemo, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import Icon from '../components/Icon'
import { supportTickets, topbarAvatars } from '../data/dashboardData'

function SupportPage() {
  const [activeTicketId, setActiveTicketId] = useState(1)
  const activeTicket = useMemo(
    () => supportTickets.find((ticket) => ticket.id === activeTicketId) || supportTickets[0],
    [activeTicketId],
  )

  return (
    <AdminLayout
      activeKey="support"
      sidebarVariant="atelier-badge"
      topbarProps={{
        searchPlaceholder: 'Search support tickets...',
        showBrand: true,
        brandText: 'Dorm Admin',
        profileName: '',
        profileRole: '',
        avatar: topbarAvatars.supportAdmin,
      }}
      mainClassName="overflow-hidden"
      contentClassName="flex min-h-[calc(100vh-72px)] overflow-hidden"
    >
      <div className="flex w-96 flex-col bg-surface-container-low">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">Inbox</h2>
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">12 NEW</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button className="whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white">All Tickets</button>
            <button className="whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-slate-100">Pending</button>
            <button className="whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-slate-100">Resolved</button>
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto">
          {supportTickets.map((ticket) => {
            const active = ticket.id === activeTicketId
            return (
              <button
                key={ticket.id}
                onClick={() => setActiveTicketId(ticket.id)}
                className={`w-full cursor-pointer px-5 py-5 text-left transition-all ${
                  active
                    ? 'border-l-4 border-primary bg-surface-container-lowest'
                    : `border-b border-outline-variant/10 ${ticket.resolved ? 'opacity-70 hover:bg-white/20' : 'hover:bg-white/40'}`
                }`}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{ticket.code}</span>
                  <span className="text-[10px] font-medium text-secondary">{ticket.time}</span>
                </div>
                <h3 className="mb-1 truncate text-sm font-bold text-on-surface">{ticket.subject}</h3>
                {!!ticket.preview && <p className="line-clamp-2 text-xs leading-relaxed text-secondary">{ticket.preview}</p>}
                <div className="mt-3 flex items-center gap-2">
                  {ticket.avatar ? <img src={ticket.avatar} alt={ticket.resident} className="h-6 w-6 rounded-full object-cover" /> : <div className="h-6 w-6 rounded-full bg-slate-200" />}
                  <span className="text-[11px] font-semibold text-on-surface">{ticket.resident}</span>
                  {ticket.status && (
                    <span className="ml-auto flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                      <span className="h-1 w-1 rounded-full bg-amber-600" /> {ticket.status}
                    </span>
                  )}
                  {ticket.resolved && (
                    <span className="ml-auto rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">RESOLVED</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden bg-surface">
        <div className="flex items-center justify-between bg-white/40 px-8 py-6">
          <div className="flex items-center gap-4">
            <img src={activeTicket.residentAvatar} alt={activeTicket.resident} className="h-12 w-12 rounded-full object-cover" />
            <div>
              <h2 className="text-xl font-bold text-on-surface">{activeTicket.resident}</h2>
              <p className="text-sm text-secondary">{activeTicket.residentInfo}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-outline-variant/20 px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-white">
              <Icon name="history" />
              View History
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]">
              <Icon name="check_circle" />
              Mark Resolved
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-8">
          {activeTicket.messages.map((message, index) => (
            <div key={`${message.from}-${index}`} className={`max-w-2xl rounded-2xl p-5 ${message.from === 'admin' ? 'ml-auto bg-primary text-white' : 'bg-white shadow-soft'}`}>
              <p className={`mb-2 text-[11px] font-bold uppercase tracking-widest ${message.from === 'admin' ? 'text-white/80' : 'text-secondary'}`}>
                {message.date}
              </p>
              <p className={`text-sm leading-relaxed ${message.from === 'admin' ? 'text-white' : 'text-on-surface'}`}>{message.text}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-outline-variant/10 bg-white p-6">
          <div className="flex items-end gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container-low p-3">
            <div className="flex gap-2 pb-2">
              <button className="rounded-full p-2 transition-colors hover:bg-white"><Icon name="attach_file" /></button>
              <button className="rounded-full p-2 transition-colors hover:bg-white"><Icon name="image" /></button>
              <button className="rounded-full p-2 transition-colors hover:bg-white"><Icon name="mood" /></button>
            </div>
            <textarea
              rows="2"
              className="flex-1 resize-none border-none bg-transparent px-2 py-2 text-sm"
              placeholder="Shift + Enter to send"
            />
            <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]">
              Send Message
              <Icon name="send" />
            </button>
          </div>
        </div>
      </div>

      <div className="no-scrollbar hidden w-80 flex-col gap-8 overflow-y-auto bg-surface-container-highest/30 p-8 xl:flex">
        <section>
          <h4 className="mb-4 text-sm font-bold text-on-surface">Ticket Info</h4>
          <div className="space-y-3 rounded-2xl bg-white/50 p-5">
            {activeTicket.ticketInfo.map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{label}</p>
                <p className="mt-1 text-sm font-semibold text-on-surface">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="mb-4 text-sm font-bold text-on-surface">Resident Profile</h4>
          <div className="space-y-3 rounded-2xl bg-white/50 p-5">
            {activeTicket.profileInfo.map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{label}</p>
                <p className="mt-1 text-sm font-semibold text-on-surface">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="mb-4 text-sm font-bold text-on-surface">Past Tickets</h4>
          <div className="space-y-3">
            {activeTicket.history.map(([date, title, status]) => (
              <div key={title} className="cursor-pointer rounded-lg bg-white/40 p-3 transition-all hover:bg-white">
                <span className="text-[10px] font-bold text-slate-400">{date}</span>
                <p className="mt-1 text-[11px] font-bold text-on-surface">{title}</p>
                <span className="text-[9px] font-bold uppercase text-emerald-600">{status}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-auto rounded-2xl border border-primary/10 bg-primary/5 p-4">
          <p className="text-center text-[11px] font-medium text-primary">
            Maintenance team has been dispatched and is estimated to arrive in 15 mins.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SupportPage


