import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const adminLinks = [
  ['Overview', '/admin'],
  ['Dorms', '/admin/dorms'],
  ['Add Dorm', '/admin/dorms/add'],
  ['Add Room', '/admin/rooms/add'],
  ['Applications', '/admin/applications'],
  ['Documents', '/admin/documents'],
  ['Availability', '/admin/availability'],
  ['Support', '/admin/support'],
  ['Settings', '/admin/settings'],
]

function AdminLayout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <h2>DormDoor Admin</h2>
        <p>{user?.name}</p>
        <nav>
          {adminLinks.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/admin'}>
              {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="btn btn-danger" onClick={logout}>
          Sign out
        </button>
      </aside>

      <section className="dashboard-main">{children}</section>
    </div>
  )
}

export default AdminLayout
