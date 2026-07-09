import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { MdCheck, MdClose, MdRefresh } from 'react-icons/md';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { api } from '../lib/api';
import { getTrackStatus } from '../data/progressUtils';
import Topbar from '../components/Topbar';

export default function Flashcards() {
  const { user } = useAuth();
  const { progress, loading } = useProgress();
  const [lessonId, setLessonId] = useState('');
  const [cards, setCards] = useState(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState('');

  const completed = !loading
    ? getTrackStatus('banking', progress.completedLessons).filter((l) => l.status === 'completed')
        .concat(getTrackStatus('computer', progress.completedLessons).filter((l) => l.status === 'completed'))
    : [];

  useEffect(() => {
    if (!lessonId || !user) return;
    const lesson = completed.find((l) => l.id === lessonId);
    if (!lesson) return;
    setCards(null);
    setIndex(0);
    setFlipped(false);
    setError('');
    (async () => {
      const cacheRef = doc(db, 'flashcards', `${user.uid}_${lessonId}`);
      const cached = await getDoc(cacheRef);
      if (cached.exists()) {
        setCards(cached.data().cards);
        return;
      }
      try {
        const res = await api.generateFlashcards({ topics: lesson.topics, title: lesson.title });
        const withStatus = res.cards.map((c) => ({ ...c, known: null }));
        setCards(withStatus);
        await setDoc(cacheRef, { cards: withStatus });
      } catch (e) {
        setError(e.message || 'Could not generate flashcards.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, user]);

  async function markCard(known) {
    if (!cards) return;
    const updated = cards.map((c, i) => (i === index ? { ...c, known } : c));
    setCards(updated);
    if (user && lessonId) {
      await updateDoc(doc(db, 'flashcards', `${user.uid}_${lessonId}`), { cards: updated }).catch(() => {});
    }
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, updated.length - 1));
  }

  return (
    <div>
      <Topbar title="Flashcards" subtitle="Definitions, terms & facts — flip to reveal" />

      <select
        value={lessonId}
        onChange={(e) => setLessonId(e.target.value)}
        className="mb-6 px-4 py-2.5 rounded-xl bg-white/60 dark:bg-ink-700/50 border border-ink-900/10 dark:border-paper-100/10 text-sm outline-none"
      >
        <option value="">Choose a completed lesson…</option>
        {completed.map((l) => (
          <option key={l.id} value={l.id}>{l.title} ({l.track})</option>
        ))}
      </select>

      {error && <p className="text-coral-500 text-sm">{error}</p>}

      {!lessonId && <p className="text-sm text-ink-500">Complete a lesson first, then generate flashcards for it here.</p>}

      {lessonId && !cards && !error && <div className="skeleton h-64 w-full max-w-md rounded-xl2" />}

      {cards && cards.length > 0 && (
        <div className="max-w-md">
          <p className="text-xs text-ink-500 mb-2">{index + 1} / {cards.length}</p>
          <div className="relative h-64 [perspective:1200px]" onClick={() => setFlipped((f) => !f)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 cursor-pointer [transform-style:preserve-3d]"
                style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: 'transform 0.5s' }}
              >
                <div className="absolute inset-0 glass-card flex items-center justify-center p-6 text-center [backface-visibility:hidden]">
                  <p className="font-semibold text-lg">{cards[index].question}</p>
                </div>
                <div
                  className="absolute inset-0 glass-card flex items-center justify-center p-6 text-center bg-gold-500/10"
                  style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                >
                  <p className="text-sm">{cards[index].answer}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="text-xs text-center text-ink-500 mt-2">Tap card to flip</p>

          <div className="flex justify-center gap-3 mt-4">
            <button onClick={() => markCard(false)} className="btn-secondary text-coral-500 border-coral-500/30">
              <MdClose /> Unknown
            </button>
            <button onClick={() => { setFlipped(false); setIndex((i) => (i + 1) % cards.length); }} className="btn-secondary">
              <MdRefresh /> Skip
            </button>
            <button onClick={() => markCard(true)} className="btn-secondary text-mint-500 border-mint-500/30">
              <MdCheck /> Known
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
