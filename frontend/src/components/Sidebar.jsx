import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'trades', label: 'Journal' },
  { id: 'nouveau', label: 'Nouveau trade' },
];

export default function Sidebar({ pageActive, onNaviguer }) {
  const { username, deconnecter } = useAuth();
  const { theme, basculerTheme } = useTheme();

  return (
    <aside className="w-60 shrink-0 border-r border-line bg-panel h-screen sticky top-0 flex flex-col">
      <div className="px-6 py-7 border-b border-line-soft">
        <h1 className="font-display text-xl text-ivory leading-tight">Journal de Trading</h1>
        <p className="text-xs text-gold-soft mt-1">by Tiavina</p>
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const actif = pageActive === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNaviguer(item.id)}
              className={`text-left px-3 py-2.5 rounded-md text-sm transition-colors ${
                actif
                  ? 'bg-panel-raised text-ivory border-l-2 border-gold pl-[10px]'
                  : 'text-slate hover:text-ivory hover:bg-panel-raised/50'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-line-soft flex flex-col gap-2">
        <button
          onClick={basculerTheme}
          className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-slate hover:text-ivory hover:bg-panel-raised/50 transition-colors"
        >
          <span>Thème {theme === 'sombre' ? 'sombre' : 'clair'}</span>
          <span className="text-xs text-slate-dim">Changer</span>
        </button>

        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm text-slate truncate">{username}</span>
          <button
            onClick={deconnecter}
            className="text-xs text-slate-dim hover:text-loss transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </aside>
  );
}
