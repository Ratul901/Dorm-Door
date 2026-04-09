import { useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import { topbarAvatars } from '../data/dashboardData'
import Icon from '../components/Icon'

const facilitiesList = ['High-speed Wi-Fi', 'Air Conditioning', '24/7 Security', 'Laundry Service', 'Cafeteria / Dining', 'Study & Fitness Center']

function AddDormPage() {
  const [selected, setSelected] = useState(['High-speed Wi-Fi', '24/7 Security'])

  const toggleFacility = (facility) => {
    setSelected((prev) => (prev.includes(facility) ? prev.filter((item) => item !== facility) : [...prev, facility]))
  }

  return (
    <AdminLayout
      activeKey="dorms"
      topbarProps={{
        searchPlaceholder: 'Search records...',
        brandText: 'DormManager',
        showBrand: true,
        profileName: 'Admin Profile',
        profileRole: 'Super Administrator',
        avatar: topbarAvatars.admin,
      }}
      contentClassName="p-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <p className="text-secondary">Dormitories <span className="mx-2">{'>'}</span> <span className="font-semibold text-primary">Add New Dormitory</span></p>
            <h1 className="mt-3 text-5xl font-black tracking-tighter">Expand the Sanctuary</h1>
            <p className="mt-2 text-[18px] text-secondary">Define a new living space for our academic community.</p>
          </div>
          <div className="flex items-center gap-5">
            <button className="text-xl text-secondary">Cancel</button>
            <button className="rounded-xl bg-primary px-8 py-4 text-xl font-bold text-white shadow-soft">Save Dormitory</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="space-y-8 xl:col-span-8">
            <section className="rounded-2xl border border-[#ece7e4] bg-white p-8">
              <h3 className="mb-8 flex items-center gap-3 text-2xl font-extrabold"><span className="rounded-full bg-blue-50 p-3 text-primary"><Icon name="segment" /></span> General Details</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Dorm Name</label><input className="mt-2 w-full rounded-xl border-none bg-[#f1ecea] px-5 py-4" placeholder="e.g. Sterling Hall" /></div>
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Block / Building</label><input className="mt-2 w-full rounded-xl border-none bg-[#f1ecea] px-5 py-4" placeholder="e.g. North Wing - Block A" /></div>
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Total Floor Count</label><input className="mt-2 w-full rounded-xl border-none bg-[#f1ecea] px-5 py-4" placeholder="0" /></div>
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Total Room Capacity</label><input className="mt-2 w-full rounded-xl border-none bg-[#f1ecea] px-5 py-4" placeholder="0" /></div>
                <div className="md:col-span-2"><label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Address</label><textarea className="mt-2 min-h-[120px] w-full rounded-xl border-none bg-[#f1ecea] px-5 py-4" placeholder="Enter the full street address and campus proximity details..." /></div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#ece7e4] bg-white p-8">
              <h3 className="mb-8 flex items-center gap-3 text-2xl font-extrabold"><span className="rounded-full bg-blue-50 p-3 text-primary"><Icon name="gavel" /></span> Rules & Policies</h3>
              <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Dormitory Regulations</label>
              <textarea className="mt-3 min-h-[220px] w-full rounded-xl border-none bg-[#f1ecea] px-5 py-4" placeholder="List the house rules, curfew times, and maintenance policies..." />
              <p className="mt-4 text-sm text-secondary">These rules will be displayed to students during the application process.</p>
            </section>
          </div>

          <div className="space-y-8 xl:col-span-4">
            <section className="rounded-2xl border border-[#ece7e4] bg-white p-8">
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-extrabold"><span className="rounded-full bg-blue-50 p-3 text-primary"><Icon name="photo_camera" /></span> Dorm Photos</h3>
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d8d2cf] text-center">
                <Icon name="add_a_photo" className="text-5xl text-secondary" />
                <p className="mt-4 text-xl font-semibold">Click to upload photos</p>
                <p className="mt-2 max-w-[220px] text-sm text-secondary">High resolution .jpg or .png up to 10MB</p>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-4">
                <div className="h-20 rounded-xl bg-slate-900" />
                <div className="flex h-20 items-center justify-center rounded-xl border-2 border-dashed border-[#d8d2cf] text-3xl text-secondary">+</div>
                <div className="flex h-20 items-center justify-center rounded-xl border-2 border-dashed border-[#d8d2cf] text-3xl text-secondary">+</div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#ece7e4] bg-white p-8">
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-extrabold"><span className="rounded-full bg-blue-50 p-3 text-primary"><Icon name="inventory_2" /></span> Facilities</h3>
              <div className="space-y-3">
                {facilitiesList.map((facility) => {
                  const checked = selected.includes(facility)
                  return (
                    <label key={facility} className="flex items-center justify-between rounded-xl bg-[#f3f6f8] px-4 py-4">
                      <span className="text-[18px] text-[#384149]">{facility}</span>
                      <input type="checkbox" checked={checked} onChange={() => toggleFacility(facility)} className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" />
                    </label>
                  )
                })}
              </div>
              <button className="mt-6 w-full rounded-xl border border-[#d8d2cf] px-5 py-4 text-lg font-semibold text-primary">Add Custom Amenity</button>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AddDormPage


