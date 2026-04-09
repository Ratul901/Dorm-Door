import { Link } from 'react-router-dom'

function Login() {
  const handleSubmit = (event) => {
    event.preventDefault()
    alert('Login form submitted')
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-surface font-body text-on-surface">
      <main className="flex min-h-screen w-full overflow-hidden">
        <div className="relative hidden bg-surface-container-highest lg:flex lg:w-1/2">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuClziyOT4xjIQ4wtp3v-kCrD5sB0FtY5eFAyzQqlSfl_QBpVaJ1tqgGrr6k6Ziwusrsw-_iwLlTxaR1YUPgqA4jPr7RFMXnoD4i8ZOp8MGQ-HxT5Iw9xzYKmnUCWLE0DfyNjTUqBrZCbywrh12dkMWfStvbDodVblNPLsdJezCLB16fZ_-pUTOBS6a-j8wmoOeL5sA28CIcIDdmpOO2idPVSIxDPwgQsFaTnBi-sDVPF52iGWp30cu3sVl4hDRJHVH7llQDjEa76D29"
            alt="Students studying in a modern library"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-16">
            <div className="space-y-6">
              <div className="max-w-md text-5xl font-black leading-tight tracking-tighter text-white">
                The Curated Sanctuary for Students.
              </div>
              <div className="h-1 w-24 bg-primary" />
              <p className="max-w-sm text-lg font-medium leading-relaxed text-white/90">
                Join an elite community of scholars in residences designed for academic excellence and refined living.
              </p>
            </div>
          </div>

          <div className="absolute left-12 top-12 flex items-center gap-2">
            <div className="custom-gradient flex h-10 w-10 items-center justify-center rounded-lg shadow-xl">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                meeting_room
              </span>
            </div>
            <span className="font-headline text-2xl font-bold tracking-tighter text-white drop-shadow-md">Dorm Door</span>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-surface p-8 md:p-12 lg:w-1/2 lg:p-24">
          <div className="w-full max-w-md">
            <div className="mb-12 flex items-center gap-2 lg:hidden">
              <div className="custom-gradient flex h-10 w-10 items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                  meeting_room
                </span>
              </div>
              <span className="font-headline text-2xl font-bold tracking-tighter text-on-surface">Dorm Door</span>
            </div>

            <div className="mb-10">
              <h1 className="mb-3 text-4xl font-black tracking-tight text-on-surface">Welcome back</h1>
              <p className="text-lg text-secondary">Please enter your details to access your sanctuary.</p>
            </div>

            <div className="mb-8 grid gap-4">
              <button className="flex items-center justify-center gap-3 rounded-lg border border-outline-variant/10 bg-surface-container-low px-4 py-3 text-sm font-medium transition hover:bg-surface-container-high">
                <span>Google</span>
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30" />
              </div>
              <div className="relative flex justify-center bg-surface px-4 text-xs font-bold uppercase tracking-widest text-on-secondary-container">
                or login with email
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-on-secondary-container">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sm text-secondary">
                    mail
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@university.edu"
                    className="w-full rounded-lg border-0 bg-surface-container-low py-3.5 pl-11 pr-4 text-on-surface outline-none transition placeholder:text-outline/50 focus:bg-white focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-on-secondary-container">
                    Password
                  </label>
                  <button type="button" className="text-xs font-bold text-primary transition hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sm text-secondary">
                    lock
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border-0 bg-surface-container-low py-3.5 pl-11 pr-4 text-on-surface outline-none transition placeholder:text-outline/50 focus:bg-white focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input id="remember" type="checkbox" className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary" />
                <label htmlFor="remember" className="ml-2 text-sm font-medium text-secondary">
                  Remember Me
                </label>
              </div>

              <button type="submit" className="custom-gradient w-full rounded-lg px-6 py-4 text-sm font-bold tracking-wide text-white shadow-lg shadow-primary/20 transition hover:scale-[1.02] active:scale-95">
                Sign In
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="font-medium text-secondary">
                New to the sanctuary?
                <Link to="/signup" className="ml-1 font-bold text-primary hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-20 border-t border-outline-variant/10 pt-8 text-center lg:text-left">
              <p className="text-xs font-medium text-on-secondary-container/60">© 2024 Dorm Door. The Curated Sanctuary for Students.</p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <button className="glass-panel flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 shadow-2xl transition hover:bg-white">
          <span className="material-symbols-outlined text-lg text-primary">help_outline</span>
          <span className="text-sm font-bold text-on-surface">Support</span>
        </button>
      </div>
    </div>
  )
}

export default Login
