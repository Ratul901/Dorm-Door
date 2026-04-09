import Sidebar from './Sidebar'
import Topbar from './Topbar'

function AdminLayout({ children, activeKey, topbarProps, contentClassName = 'p-8' }) {
  return (
    <div className="min-h-screen bg-background text-[#1c1b1b]">
      <Sidebar activeKey={activeKey} />
      <main className="ml-64 min-h-screen">
        <Topbar {...topbarProps} />
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout


