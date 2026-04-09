import Navbar from './Navbar'

function PageShell({ children, buttonLabel, buttonTo }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar buttonLabel={buttonLabel} buttonTo={buttonTo} />
      {children}
    </div>
  )
}

export default PageShell
