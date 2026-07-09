import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdSearch, MdArrowForward } from 'react-icons/md';
import Topbar from '../components/Topbar';
import { ALL_LESSONS } from '../data/roadmap';

export default function Search() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase();
    return ALL_LESSONS.filter(
      (l) => l.title.toLowerCase().includes(needle) || l.topics.some((t) => t.toLowerCase().includes(needle))
    ).slice(0, 25);
  }, [q]);

  return (
    <div>
      <Topbar title="Search" subtitle="Topics · Terms · Concepts · Questions" />

      <div className="relative mb-6">
        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" size={20} />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search topics, terms, or concepts (e.g. Repo Rate, DNS, NPA)…"
          className="w-full pl-11 pr-4 py-3.5 rounded-xl glass-card-sm outline-none focus:ring-2 focus:ring-gold-500/40 text-sm"
        />
      </div>

      {q && results.length === 0 && (
        <div className="glass-card p-6 text-center">
          <p className="text-sm text-ink-500 mb-3">No matching topic found in the roadmap.</p>
          <button onClick={() => navigate('/doubt')} className="btn-primary">Ask the AI Doubt Solver instead</button>
        </div>
      )}

      <div className="space-y-2">
        {results.map((l) => (
          <Link
            key={l.id}
            to={`/lesson/${l.id}`}
            className="flex items-center justify-between glass-card-sm px-4 py-3 hover:border-gold-500/40 transition-colors"
          >
            <div>
              <p className="text-sm font-medium">{l.title}</p>
              <p className="text-xs text-ink-500 dark:text-paper-200/60">{l.track === 'banking' ? 'Banking Awareness' : 'Computer Awareness'} · Week {l.week}, Day {l.day}</p>
            </div>
            <MdArrowForward className="text-ink-500" />
          </Link>
        ))}
      </div>
    </div>
  );
}
