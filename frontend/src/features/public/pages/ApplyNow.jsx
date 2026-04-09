import PageShell from '../components/PageShell'

function ApplyNow() {
  const handleSubmit = (event) => {
    event.preventDefault()
    alert('Application submitted')
  }

  return (
    <PageShell buttonLabel="Login" buttonTo="/login">
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <header className="mb-12">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tighter text-on-surface md:text-6xl">Apply Now</h1>
          <p className="max-w-2xl text-lg text-secondary">
            Complete the form to request this dorm room. Our curators will review your application within 24 hours.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-8">
            <section className="flex flex-col items-center gap-8 rounded-xl bg-surface-container-lowest p-8 shadow-sm ring-1 ring-outline-variant/15 md:flex-row">
              <div className="h-32 w-full overflow-hidden rounded-lg bg-surface-container md:w-48">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD-CKDuSvjbEoAu7oNHEx6q8eWilj3x1sxlsIAmJ86Dn7TlWmqrnpsm-6fcV321iz8a6v5v6GW3pnOTdybOk5KBryo7ufhBWuFRUnaSUGyIjrIp4gmz7ExnawAckWw_WCSv_XoKg5wLjgaumOW6A-BQ-krOfD8_22B1055zVvMjEcJeG95jOg1FW5ubs5wf8DVmJuv0qyOpPFwkUreLZqr4n14qZTv3ERId5tpZR6J9TzmnkKyKxL4oJY3af7fIdKbnyQoip0iNS5S"
                  alt="Selected room"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid flex-1 grid-cols-2 gap-6 md:grid-cols-4">
                <div>
                  <span className="mb-1 block w-fit rounded bg-tertiary-container/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-secondary-container">
                    Selected Room
                  </span>
                  <h3 className="text-xl font-bold">The Zenith Suite</h3>
                </div>
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-secondary-container">Location</span>
                  <p className="font-medium text-on-surface">Block A, Single</p>
                </div>
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-secondary-container">Monthly Rent</span>
                  <p className="font-bold text-primary">৳8,500</p>
                </div>
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-secondary-container">Status</span>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Available
                  </span>
                </div>
              </div>
            </section>

            <form className="space-y-12" onSubmit={handleSubmit}>
              <section>
                <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container/20 text-sm text-primary">01</span>
                  Student Personal Information
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    ['Full Name', 'e.g. Adnan Sami', 'text'],
                    ['Email Address', 'hello@university.edu', 'email'],
                    ['Phone Number', '+880 1XXX XXXXXX', 'tel'],
                    ['Student ID', '2024-XXXX-XX', 'text'],
                    ['Department', 'Computer Science', 'text'],
                    ['University', 'Brac University', 'text'],
                  ].map(([label, placeholder, type]) => (
                    <div key={label} className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-secondary">{label}</label>
                      <input type={type} placeholder={placeholder} className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 outline-none transition focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20" />
                    </div>
                  ))}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary">Gender</label>
                    <select className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 outline-none transition focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20">
                      <option>Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary">Present Address</label>
                    <input type="text" placeholder="Dhanmondi, Dhaka" className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 outline-none transition focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container/20 text-sm text-primary">02</span>
                  Room & Preferences
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary">Preferred Room Type</label>
                    <select className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 outline-none transition focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20">
                      <option>Single Room (Premium)</option>
                      <option>Shared Double</option>
                      <option>Studio Suite</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary">Block / Floor Preference</label>
                    <input type="text" placeholder="e.g. Block A, 4th Floor" className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 outline-none transition focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary">Move-in Date</label>
                    <input type="date" className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 outline-none transition focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary">Special Requests</label>
                    <textarea rows="3" placeholder="Any specific requirements or notes for the staff..." className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 outline-none transition focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container/20 text-sm text-primary">03</span>
                  Emergency Contact
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {['Guardian Name', 'Relationship', 'Phone Number'].map((label) => (
                    <div key={label} className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-secondary">{label}</label>
                      <input type="text" placeholder={label} className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 outline-none transition focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20" />
                    </div>
                  ))}
                </div>
              </section>

              <button type="submit" className="rounded-lg bg-gradient-to-br from-primary to-primary-container px-8 py-4 font-bold text-white transition hover:scale-[1.01]">
                Submit Application
              </button>
            </form>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-sm ring-1 ring-outline-variant/15">
              <h3 className="mb-4 text-xl font-bold">Application Tips</h3>
              <ul className="space-y-3 text-secondary">
                <li>• Double-check your student ID and email.</li>
                <li>• Choose the correct move-in date.</li>
                <li>• Add any room preference clearly.</li>
                <li>• Keep your guardian contact active.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </PageShell>
  )
}

export default ApplyNow
