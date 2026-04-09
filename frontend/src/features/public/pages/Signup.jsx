import { Link } from 'react-router-dom'

function Signup() {
  const handleSubmit = (event) => {
    event.preventDefault()
    alert('Signup form submitted')
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface antialiased">
      <header className="pointer-events-none fixed top-0 z-50 flex w-full items-center justify-between px-8 py-6">
        <div className="pointer-events-auto text-2xl font-bold tracking-tighter text-on-surface">Dorm Door</div>
      </header>

      <main className="flex h-screen flex-grow flex-col md:flex-row">
        <section className="relative hidden overflow-hidden bg-surface-container-highest md:flex md:w-1/2">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuATh68Rib8FXHCBtYjdubWFB0sLIqI8iwIB_u14AjZRnmBuVh92B1z-iYwdHuRN3FkLf84r-U4JnUy2s_02wbxl1t617N568tdGVDQ-XbEcaOnrU-tEbRWpK2xQuAWPjfd6JTbFL7D7iozA9UPjQlHodnwPoCdTuDpEpuNuKNwY2qj7TrjWZI6J3jQcWjNeEiAlrgFMM4AHSHNuJ9rPHqUsKrj6zKItjiIhMdezhZFpJ4ttUXgIk8jWGR33re91FLu5JUGWJ3fd3dNf"
            alt="Modern dormitory common area"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="relative z-10 self-end p-16">
            <span className="mb-6 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-md">
              Join the Sanctuary
            </span>
            <h1 className="mb-6 max-w-xl text-5xl font-extrabold leading-tight tracking-tight text-white">
              Elevated Living for the Academic Elite.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-white/80">
              Discover a curated community designed for focus, comfort, and connection. Your journey to better housing starts here.
            </p>
          </div>
        </section>

        <section className="flex w-full items-center justify-center overflow-y-auto bg-surface p-8 md:w-1/2 md:p-16 lg:p-24">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-on-surface">Create Account</h2>
              <p className="text-base text-secondary">Enter your details to register with Dorm Door.</p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4">
              <button className="flex items-center justify-center gap-3 rounded-lg border border-outline-variant px-4 py-3 transition duration-300 hover:bg-surface-container-low">
                <span className="text-sm font-semibold text-on-surface">Google</span>
              </button>
            </div>

            <div className="relative mb-8 flex items-center">
              <div className="flex-grow border-t border-outline-variant/30" />
              <span className="mx-4 flex-shrink text-xs font-bold uppercase tracking-widest text-secondary/50">
                or register with email
              </span>
              <div className="flex-grow border-t border-outline-variant/30" />
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="full_name" className="block text-xs font-bold uppercase tracking-wider text-secondary">
                  Full Name
                </label>
                <input id="full_name" type="text" placeholder="Alex Sterling" className="w-full rounded-lg border-transparent bg-surface-container-high px-4 py-3.5 text-on-surface transition duration-300 placeholder:text-secondary/40 focus:border-primary focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary" />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-secondary">Email Address</label>
                  <input id="email" type="email" placeholder="alex@university.edu" className="w-full rounded-lg border-transparent bg-surface-container-high px-4 py-3.5 text-on-surface transition duration-300 placeholder:text-secondary/40 focus:border-primary focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary" />
                </div>
                <div className="space-y-1">
                  <label htmlFor="student_id" className="block text-xs font-bold uppercase tracking-wider text-secondary">Student ID</label>
                  <input id="student_id" type="text" placeholder="U12345678" className="w-full rounded-lg border-transparent bg-surface-container-high px-4 py-3.5 text-on-surface transition duration-300 placeholder:text-secondary/40 focus:border-primary focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-secondary">Phone Number</label>
                <input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="w-full rounded-lg border-transparent bg-surface-container-high px-4 py-3.5 text-on-surface transition duration-300 placeholder:text-secondary/40 focus:border-primary focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary" />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-secondary">Password</label>
                  <input id="password" type="password" placeholder="••••••••" className="w-full rounded-lg border-transparent bg-surface-container-high px-4 py-3.5 text-on-surface transition duration-300 placeholder:text-secondary/40 focus:border-primary focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary" />
                </div>
                <div className="space-y-1">
                  <label htmlFor="confirm_password" className="block text-xs font-bold uppercase tracking-wider text-secondary">Confirm Password</label>
                  <input id="confirm_password" type="password" placeholder="••••••••" className="w-full rounded-lg border-transparent bg-surface-container-high px-4 py-3.5 text-on-surface transition duration-300 placeholder:text-secondary/40 focus:border-primary focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <input id="terms" type="checkbox" className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary" />
                <label htmlFor="terms" className="text-sm leading-tight text-secondary">
                  I agree to the <button type="button" className="font-semibold text-primary hover:underline">Terms & Conditions</button> and <button type="button" className="font-semibold text-primary hover:underline">Privacy Policy</button>.
                </label>
              </div>

              <button type="submit" className="w-full rounded-lg bg-gradient-to-br from-primary to-primary-container py-4 text-base font-bold text-white shadow-lg shadow-primary/20 transition duration-200 hover:scale-[1.01] active:scale-95">
                Create Account
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm text-secondary">
                Already have an account?
                <Link to="/login" className="ml-1 font-bold text-primary hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex w-full flex-col items-center justify-between gap-4 bg-surface-container-highest px-12 py-10 text-center md:flex-row md:text-left">
        <div className="text-lg font-black text-on-surface">Dorm Door</div>
        <div className="text-sm tracking-wide text-secondary">© 2024 Dorm Door. The Curated Sanctuary for Students.</div>
        <div className="flex gap-8">
          <button className="text-sm font-medium text-secondary transition hover:text-on-surface">Privacy Policy</button>
          <button className="text-sm font-medium text-secondary transition hover:text-on-surface">Terms of Service</button>
          <button className="text-sm font-medium text-secondary transition hover:text-on-surface">University Partners</button>
        </div>
      </footer>
    </div>
  )
}

export default Signup
