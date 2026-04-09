import AdminLayout from '../components/layout/AdminLayout'
import { topbarAvatars } from '../data/dashboardData'
import Icon from '../components/Icon'

function Field({ label, value, accent = false, type = 'text' }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">{label}</label>
      <input className={`w-full rounded-lg border-none px-4 py-3 text-sm font-medium ${accent ? 'bg-[#ebe7e7] text-primary font-bold' : 'bg-[#f0edec]'}`} type={type} defaultValue={value} />
    </div>
  )
}

function SettingsPage() {
  return (
    <AdminLayout
      activeKey="settings"
      topbarProps={{
        searchPlaceholder: 'Quick search...',
        profileName: 'Admin User',
        profileRole: 'Head Admin',
        avatar: topbarAvatars.admin,
      }}
      contentClassName="p-8"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h2 className="text-5xl font-extrabold tracking-tight">Settings</h2>
            <p className="text-secondary text-sm mt-1">Configure your administrative environment and personal profile.</p>
          </div>
          <div className="flex items-center gap-4 text-secondary">
            <button className="p-2 rounded-full hover:bg-slate-100"><Icon name="notifications" /></button>
            <button className="p-2 rounded-full hover:bg-slate-100"><Icon name="help_outline" /></button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <section className="md:col-span-8 rounded-xl border border-[#ece7e4] bg-white p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="relative">
              <img alt="Admin profile" className="h-32 w-32 rounded-xl object-cover" src={topbarAvatars.admin} />
              <button className="absolute -bottom-2 -right-2 rounded-lg bg-primary p-2 text-white shadow-lg"><Icon name="edit" className="text-sm" /></button>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 w-full">
              <Field label="Full Name" value="Alexander Sterling" />
              <Field label="Role" value="Head Admin" accent />
              <Field label="Email" value="a.sterling@atelier.edu" type="email" />
              <Field label="Phone Number" value="+1(555) 012-3456" type="tel" />
            </div>
          </section>

          <section className="md:col-span-4 rounded-xl bg-[#f0edec] p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><Icon name="tune" className="text-primary" /> Preferences</h3>
              <div className="flex items-center justify-between rounded-lg bg-white p-3">
                <span className="text-sm font-semibold">Dark Mode</span>
                <button className="relative h-6 w-11 rounded-full bg-[#d9dbe0] p-1"><div className="h-4 w-4 rounded-full bg-white" /></button>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Notification Frequency</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button className="rounded-lg bg-primary py-2 text-xs font-bold text-white">Instant</button>
                  <button className="rounded-lg bg-white py-2 text-xs font-bold text-secondary">Daily Digest</button>
                </div>
              </div>
            </div>
          </section>

          <section className="md:col-span-6 rounded-xl border border-[#ece7e4] bg-white p-8 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><Icon name="settings" className="text-primary" /> System Configuration</h3>
            <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-4">
              <div>
                <p className="text-sm font-bold text-red-700">Maintenance Mode</p>
                <p className="text-xs text-red-500">Disable public portal access for updates.</p>
              </div>
              <button className="relative h-6 w-12 rounded-full bg-red-200 p-1"><div className="ml-auto h-4 w-4 rounded-full bg-red-600" /></button>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Default Language</label>
              <select className="mt-2 w-full rounded-lg border-none bg-[#f0edec] px-4 py-3">
                <option>English (US)</option>
                <option>Bengali</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">System Email Notifications</label>
              <input className="mt-2 w-full rounded-lg border-none bg-[#f0edec] px-4 py-3" defaultValue="system@atelier.edu" />
            </div>
          </section>

          <section className="md:col-span-6 rounded-xl bg-[#f0edec] p-8 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><Icon name="shield" className="text-primary" /> Security</h3>
            <div className="space-y-3">
              <input className="w-full rounded-lg border-none bg-white px-4 py-3 text-sm" placeholder="Old Password" type="password" />
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-lg border-none bg-white px-4 py-3 text-sm" placeholder="New Password" type="password" />
                <input className="rounded-lg border-none bg-white px-4 py-3 text-sm" placeholder="Confirm New" type="password" />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[#e3ddda] pt-4">
              <div>
                <p className="font-bold">Two-Factor Authentication</p>
                <p className="text-xs text-secondary">Enhance account security via SMS/Email.</p>
              </div>
              <button className="relative h-6 w-12 rounded-full bg-primary p-1"><div className="ml-auto h-4 w-4 rounded-full bg-white" /></button>
            </div>
            <div className="border-t border-[#e3ddda] pt-4 text-sm text-secondary">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest">Last Login Activity</p>
              <div className="flex justify-between py-1"><span>London, UK - Chrome / Mac OS</span><span className="text-[#1c1b1b]">Today, 09:24 AM</span></div>
              <div className="flex justify-between py-1"><span>Paris, FR - Safari / iOS</span><span className="text-[#1c1b1b]">Oct 12, 02:45 PM</span></div>
            </div>
          </section>
        </div>

        <div className="mt-10 flex justify-end gap-6">
          <button className="px-6 py-4 text-lg text-secondary">Discard Changes</button>
          <button className="rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-soft">Save Configuration</button>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SettingsPage


