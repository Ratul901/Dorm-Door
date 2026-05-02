import SuperAdminNavbar from './SuperAdminNavbar'
import SuperAdminSidebar from './SuperAdminSidebar'

function SuperAdminLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <SuperAdminSidebar />
      <main className="ml-64 min-h-screen">
        <SuperAdminNavbar title={title} subtitle={subtitle} />
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

export default SuperAdminLayout
