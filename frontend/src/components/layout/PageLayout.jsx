import MainNav from './MainNav'

function PageLayout({ children }) {
  return (
    <div className="app-shell">
      <MainNav />
      <main className="container page-content">{children}</main>
    </div>
  )
}

export default PageLayout
