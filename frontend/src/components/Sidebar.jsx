import { NavLink } from 'react-router-dom';
import {
  MdDashboard, MdMap, MdQuiz, MdTrendingUp, MdReplay, MdStyle,
  MdChatBubbleOutline, MdArticle, MdSearch, MdStickyNote2, MdSettings, MdLogout,
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: MdDashboard, end: true },
  { to: '/roadmap', label: 'Roadmap', icon: MdMap },
  { to: '/progress', label: 'Progress', icon: MdTrendingUp },
  { to: '/revision', label: 'Revision', icon: MdReplay },
  { to: '/flashcards', label: 'Flashcards', icon: MdStyle },
  { to: '/doubt', label: 'Ask Doubt', icon: MdChatBubbleOutline },
  { to: '/current-affairs', label: 'Current Affairs', icon: MdArticle },
  { to: '/search', label: 'Search', icon: MdSearch },
  { to: '/notes', label: 'Notes', icon: MdStickyNote2 },
  { to: '/settings', label: 'Settings', icon: MdSettings },
];

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 glass-card m-3 mr-0 p-4">
      <div className="flex items-center gap-2 px-2 py-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center font-display font-bold text-ink-950">B</div>
        <div>
          <p className="font-display font-bold leading-tight">BankAI Coach</p>
          <p className="text-xs text-ink-500 dark:text-paper-200/60">SBI PO · IBPS PO</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gold-500/15 text-gold-600 dark:text-gold-400'
                  : 'text-ink-700 dark:text-paper-100/80 hover:bg-ink-900/5 dark:hover:bg-paper-100/5'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-900/10 dark:border-paper-100/10 pt-3 mt-3">
        <p className="px-2 text-xs text-ink-500 dark:text-paper-200/60 truncate mb-2">{user?.email}</p>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-coral-500 hover:bg-coral-500/10 w-full transition-colors">
          <MdLogout size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}
