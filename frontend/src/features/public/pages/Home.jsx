import { Link } from 'react-router-dom'
import DormCard from '../components/DormCard'
import PageShell from '../components/PageShell'
import { featuredDorms } from '../data/dormData'

function Home() {
  return (
    <PageShell buttonLabel="Login" buttonTo="/login">
      <main className="pt-24">
        <section className="relative overflow-hidden px-6 min-h-[900px] flex items-center md:px-12">
          <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="z-10 lg:col-span-6">
              <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-on-surface md:text-7xl">
                Find Your Perfect <br />
                <span className="text-primary">Dorm Easily</span>
              </h1>
              <p className="mb-10 max-w-lg text-xl leading-relaxed text-secondary">
                Curated student living spaces designed for focus and community. Experience premium housing that feels like home.
              </p>

              <div className="mb-12 flex flex-wrap gap-4">
                <Link to="/browse-dorms" className="rounded-lg bg-gradient-to-br from-primary to-primary-container px-8 py-4 text-lg font-bold text-white transition hover:shadow-xl">
                  Browse Dorms
                </Link>
                <Link to="/apply-now" className="rounded-lg border border-outline-variant/15 bg-surface-container-lowest px-8 py-4 text-lg font-bold text-on-surface transition hover:bg-surface-container">
                  Apply Now
                </Link>
              </div>

              <div className="max-w-xl rounded-xl border border-outline-variant/10 bg-surface-container-lowest/80 p-2 shadow-2xl backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-1 border-outline-variant/20 px-6 py-3 md:border-r">
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-secondary">Location</label>
                    <input type="text" placeholder="Which campus?" className="w-full border-none bg-transparent p-0 text-on-surface placeholder:text-outline-variant focus:ring-0" />
                  </div>
                  <div className="flex-1 px-6 py-3">
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-secondary">Room Type</label>
                    <select className="w-full appearance-none border-none bg-transparent p-0 text-on-surface focus:ring-0">
                      <option>Studio Suite</option>
                      <option>Shared Apartment</option>
                      <option>Single Room</option>
                    </select>
                  </div>
                  <Link to="/browse-dorms" className="m-1 flex aspect-square items-center justify-center rounded-lg bg-primary p-4 text-white transition hover:bg-primary-container">
                    <span className="material-symbols-outlined">search</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative min-h-[500px] lg:col-span-6">
              <div className="absolute inset-0 -rotate-3 scale-105 rounded-[2rem] bg-secondary-container/20" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnOSsm-JxpT10RUimKpQjLL1dFCRJx4KCPdMPuxQeQy43MNc7rTzqLB2m-ZirussIAkpW49lAnx779dmJ-HJn8nvdsRhOjZNVZofUvX80tZWIbWxiFqgnVA14RZ6f08-IHodei-oAOxxC2PXsas0OuP49X2QGl3DdkKZRU_n5gZXesCpUygyR4QJRFCQkGKs886MiDsZu0ERAbaytA9QHzbzZhnUzt5oqSRHbzwVM1Q__ou1ztCxvynKCIjGEleHRbF7inYSdCTd8K"
                alt="Modern student lounge"
                className="relative h-[600px] w-full rounded-[2rem] object-cover shadow-2xl transition duration-700 hover:grayscale-0 lg:h-[600px]"
              />
              <div className="absolute -bottom-8 -left-2 z-20 max-w-[220px] rounded-2xl bg-surface-container-lowest p-6 shadow-xl md:-left-8">
                <div className="mb-1 text-3xl font-bold text-primary">98%</div>
                <p className="text-xs font-medium uppercase tracking-wider text-secondary">Student Satisfaction Rating</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-outline-variant/10 bg-surface-container-low py-12">
          <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-center gap-8 px-6 md:px-12">
            <span className="text-sm font-bold uppercase tracking-widest text-secondary">Quick Filters</span>
            <div className="flex flex-wrap gap-3">
              {[
                ['apartment', 'Building'],
                ['payments', 'Budget'],
                ['hotel', 'Room Type'],
                ['wifi', 'Amenities'],
              ].map(([icon, label]) => (
                <button key={label} className="glass-chip flex items-center gap-2 rounded-full bg-secondary-container/40 px-5 py-2 text-sm font-semibold text-on-secondary-container transition hover:bg-secondary-container">
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-screen-2xl px-6 py-24 md:px-12">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="mb-4 text-4xl font-bold tracking-tight">Curated Residences</h2>
              <p className="max-w-md text-secondary">Hand-picked living spaces that prioritize your academic success and comfort.</p>
            </div>
            <Link to="/browse-dorms" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
              Explore All Residences
              <span className="material-symbols-outlined transition group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {featuredDorms.map((dorm) => (
              <DormCard key={dorm.id} dorm={dorm} />
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  )
}

export default Home
