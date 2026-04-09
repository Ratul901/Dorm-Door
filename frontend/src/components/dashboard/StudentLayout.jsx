import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const studentLinks = [
  ['Overview', '/student'],
  ['Applications', '/student/applications'],
  ['Maintenance', '/student/maintenance'],
  ['Documents', '/student/documents'],
  ['Reviews', '/student/reviews'],
  ['Profile', '/student/profile'],
  ['Support', '/student/support'],
]

function StudentLayout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <h2>DormDoor Student</h2>
        <p>{user?.name}</p>
        <nav>
          {studentLinks.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/student'}>
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

export default StudentLayout
