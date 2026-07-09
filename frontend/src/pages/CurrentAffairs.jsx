import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { api } from '../lib/api';
import Topbar from '../components/Topbar';
import { SkeletonBlock } from '../components/Skeleton';

const CATEGORIES = ['Banking News', 'Economy News', 'Government Schemes', 'Appointments', 'Awards', 'Sports', 'International News', 'RBI Updates', 'Financial News'];

export default function CurrentAffairs() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError('');
    (async () => {
      const cacheRef = doc(db, 'current_affairs', date);
      const cached = await getDoc(cacheRef);
      if (cached.exists()) {
        if (!cancelled) setData(cached.data());
        return;
      }
      try {
        const res = await api.getCurrentAffairs(date);
        if (!cancelled) {
          setData(res);
          await setDoc(cacheRef, res);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load current affairs.');
      }
    })();
    return () => { cancelled = true; };
  }, [date]);

  return (
    <div>
      <Topbar title="Current Affairs" subtitle="Daily banking, economy & general awareness updates" />

      <input
        type="date"
        value={date}
        max={new Date().toISOString().slice(0, 10)}
        onChange={(e) => setDate(e.target.value)}
        className="mb-6 px-4 py-2.5 rounded-xl bg-white/60 dark:bg-ink-700/50 border border-ink-900/10 dark:border-paper-100/10 text-sm outline-none"
      />

      {error && <p className="text-coral-500 text-sm">{error}</p>}
      {!data && !error && (
        <div className="space-y-3">
          <SkeletonBlock className="h-32 w-full" />
          <SkeletonBlock className="h-32 w-full" />
        </div>
      )}

      {data && (
        <div className="grid md:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            data.sections?.[cat] && (
              <div key={cat} className="glass-card p-5">
                <p className="font-semibold mb-2 text-gold-600 dark:text-gold-400">{cat}</p>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{data.sections[cat]}</ReactMarkdown>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
