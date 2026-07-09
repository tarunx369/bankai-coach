import { MdLightMode, MdDarkMode, MdLocalFireDepartment } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

export default function Topbar({ title, subtitle }) {
  const { theme, toggleTheme } = useTheme();
  const { progress } = useProgress();

  return (
    <div className="flex items-center justify-between mb-6 animate-rise">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-ink-500 dark:text-paper-200/60 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="glass-card-sm flex items-center gap-1.5 px-3 py-2 text-sm font-mono font-semibold text-gold-600 dark:text-gold-400">
          <MdLocalFireDepartment size={18} />
          {progress?.streak || 0}
        </div>
        <div className="glass-card-sm px-3 py-2 text-sm font-mono font-semibold">
          Lv.{progress?.level || 1} · {progress?.xp || 0} XP
        </div>
        <button
          onClick={toggleTheme}
          className="glass-card-sm p-2.5 hover:scale-105 transition-transform"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
        </button>
      </div>
    </div>
  );
}
