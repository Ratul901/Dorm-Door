import Icon from '../Icon'
import { useLanguage } from '../../../../context/LanguageContext'

function Topbar({ searchPlaceholder = 'Search...', profileName = 'Admin User', profileRole = 'Housing Authority', avatar, brandText = '', showBrand = false }) {
  const { language, setLanguage } = useLanguage()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#ece7e4] bg-white/75 px-8 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-6">
        {showBrand && <h2 className="text-[18px] font-extrabold text-primaryDark">{brandText}</h2>}
        <div className="relative">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-80 rounded-full border-none bg-[#f1ecea] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:bg-white focus:shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div data-no-translate="true" className="hidden items-center gap-2 text-xs font-bold tracking-widest text-secondary md:flex">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`transition hover:text-primary ${language === 'en' ? 'text-primary' : ''}`}
          >
            EN
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => setLanguage('bn')}
            className={`transition hover:text-primary ${language === 'bn' ? 'text-primary' : ''}`}
          >
            BN
          </button>
        </div>

        <button className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100">
          <Icon name="notifications" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </button>
        <button className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100">
          <Icon name="help_outline" />
        </button>
        <div className="mx-2 h-8 w-px bg-[#e8e1dc]" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-[#1b1b1b]">{profileName}</p>
            <p className="text-[11px] text-secondary">{profileRole}</p>
          </div>
          <img src={avatar} alt="Admin" className="h-10 w-10 rounded-full object-cover shadow-sm" />
        </div>
      </div>
    </header>
  )
}

export default Topbar
