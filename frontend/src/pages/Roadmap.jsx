import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLock, MdCheckCircle, MdPlayCircle, MdReplay } from 'react-icons/md';
import Topbar from '../components/Topbar';
import { useProgress } from '../context/ProgressContext';
import { BANKING_ROADMAP, COMPUTER_ROADMAP } from '../data/roadmap';
import { getTrackStatus } from '../data/progressUtils';

const statusStyles = {
  completed: 'bg-mint-500 text-white',
  unlocked: 'bg-gold-500 text-ink-950 ring-4 ring-gold-500/25',
  locked: 'bg-ink-900/10 dark:bg-paper-100/10 text-ink-500 dark:text-paper-200/40',
};

function StatusIcon({ status, isRevision }) {
  if (status === 'completed') return <MdCheckCircle size={18} />;
  if (status === 'locked') return <MdLock size={16} />;
  return isRevision ? <MdReplay size={18} /> : <MdPlayCircle size={18} />;
}

function TrackLedger({ title, roadmap, statused }) {
  const byWeek = {};
  statused.forEach((l) => {
    byWeek[l.week] = byWeek[l.week] || { title: l.weekTitle, days: [] };
    byWeek[l.week].days.push(l);
  });

  return (
    <div className="glass-card p-5 mb-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="relative pl-6 border-l-2 border-dashed border-ink-900/15 dark:border-paper-100/15 space-y-6">
        {Object.entries(byWeek).map(([week, wk]) => (
          <div key={week} className="relative">
            <p className="text-xs uppercase tracking-wide text-ink-500 dark:text-paper-200/60 mb-2 -ml-6 pl-2">
              Week {week} · {wk.title}
            </p>
            <div className="flex flex-wrap gap-2">
              {wk.days.map((d) => {
                const content = (
                  <div
                    key={d.id}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform ${statusStyles[d.status]} ${d.status === 'unlocked' ? 'hover:scale-110' : ''}`}
                    title={d.title}
                  >
                    <StatusIcon status={d.status} isRevision={d.isRevision} />
                  </div>
                );
                return d.status === 'locked' ? (
                  <div key={d.id}>{content}</div>
                ) : (
                  <Link key={d.id} to={`/lesson/${d.id}`}>{content}</Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Roadmap() {
  const { progress, loading } = useProgress();
  const [tab, setTab] = useState('banking');

  if (loading) return <div className="skeleton h-96 w-full rounded-xl2" />;

  const bankingStatus = getTrackStatus('banking', progress.completedLessons);
  const computerStatus = getTrackStatus('computer', progress.completedLessons);

  return (
    <div>
      <Topbar title="Learning Roadmap" subtitle="Weeks → Days → Topics. Only today's lesson unlocks next." />

      <div className="flex gap-2 mb-6">
        {['banking', 'computer'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t ? 'bg-gold-500 text-ink-950' : 'glass-card-sm'}`}
          >
            {t === 'banking' ? 'Banking Awareness' : 'Computer Awareness'}
          </button>
        ))}
      </div>

      {tab === 'banking' ? (
        <TrackLedger title="Banking Awareness" roadmap={BANKING_ROADMAP} statused={bankingStatus} />
      ) : (
        <TrackLedger title="Computer Awareness" roadmap={COMPUTER_ROADMAP} statused={computerStatus} />
      )}
    </div>
  );
}
