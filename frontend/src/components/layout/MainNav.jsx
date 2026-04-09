import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'

function MainNav() {
  const { user, isAuthenticated, logout } = useAuth()
  const { language, setLanguage } = useLanguage()

  const dashboardPath = user?.role === 'admin' ? '/admin' : '/student'

  return (
    <header className="main-nav">
      <div className="container nav-row">
        <Link to="/" className="brand">
          DormDoor
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/browse-dorms">Browse Dorms</NavLink>
          <NavLink to="/apply-now">Apply Now</NavLink>
        </nav>

        <div className="nav-actions">
          <div data-no-translate="true" className="row-gap" style={{ gap: '0.35rem' }}>
            <button
              type="button"
              className={`btn btn-outline ${language === 'en' ? 'text-[#0f5fff]' : ''}`}
              style={{ padding: '0.35rem 0.6rem', minWidth: '48px' }}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`btn btn-outline ${language === 'bn' ? 'text-[#0f5fff]' : ''}`}
              style={{ padding: '0.35rem 0.6rem', minWidth: '48px' }}
              onClick={() => setLanguage('bn')}
            >
              BN
            </button>
          </div>

          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="btn btn-outline">
                Dashboard
              </Link>
              <button type="button" className="btn btn-danger" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default MainNav
