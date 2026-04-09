import { Link } from 'react-router-dom'

function DormCard({ dorm }) {
  const statusColor =
    dorm.status === 'Available'
      ? 'bg-emerald-500'
      : dorm.status === 'Limited Seats'
        ? 'bg-amber-500'
        : 'bg-red-500'

  return (
    <div className="group rounded-2xl bg-surface p-4 transition duration-300 hover:scale-[1.02] hover:bg-surface-container-lowest">
      <div className="relative mb-5 h-72 overflow-hidden rounded-xl">
        <img src={dorm.image} alt={dorm.name} className="h-full w-full object-cover" />
        <div className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white ${statusColor}`}>
          {dorm.status}
        </div>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">{dorm.type}</p>
      <h3 className="mt-2 text-xl font-bold">{dorm.name}</h3>
      {dorm.location && <p className="mt-2 text-sm text-secondary">{dorm.location}</p>}

      <div className="mt-5 flex items-center justify-between">
        <span className="text-lg font-extrabold text-on-surface">
          {dorm.price}
          <span className="text-sm font-normal text-secondary">/mo</span>
        </span>
        <Link
          to={dorm.id === 'zenith-suite' ? `/dorms/${dorm.id}` : '/apply-now'}
          className="rounded-lg bg-surface-container-highest px-4 py-2 text-sm font-bold transition hover:bg-primary hover:text-white"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default DormCard
