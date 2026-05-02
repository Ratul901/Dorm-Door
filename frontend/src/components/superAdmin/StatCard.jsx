function StatCard({ label, value, icon: Icon, tone = 'bg-white' }) {
  return (
    <div className={`rounded-xl border border-[#e8edf3] p-5 shadow-sm ${tone}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value ?? 0}</p>
        </div>
        {Icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f0ff] text-primary">
            <Icon size={21} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default StatCard
