import { useState, useEffect } from 'react';
import { MdReplay, MdCheckCircle, MdSchedule } from 'react-icons/md';
import Topbar from '../components/Topbar';
import { useProgress } from '../context/ProgressContext';
import { api } from '../lib/api';
import { REVISION_INTERVALS_DAYS } from '../data/roadmap';

function RevisionQuiz({ item, onDone }) {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.generateRevisionQuiz({ topics: item.topics, count: 10 })
      .then((res) => setQuestions(res.questions))
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <p className="text-coral-500 text-sm">{error}</p>;
  if (!questions) return <div className="skeleton h-40 w-full" />;

  if (submitted) {
    const correct = questions.filter((q, i) => answers[i] === q.correctIndex).length;
    return (
      <div className="text-center py-6">
        <p className="text-2xl font-mono font-bold mb-1">{correct}/{questions.length}</p>
        <p className="text-sm text-ink-500 mb-4">Revision quiz complete</p>
        <button onClick={onDone} className="btn-primary">Continue</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={i} className="border-b border-ink-900/10 dark:border-paper-100/10 pb-3">
          <p className="text-sm font-medium mb-2">{i + 1}. {q.question}</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                className={`text-left px-3 py-2 rounded-lg text-xs border ${answers[i] === oi ? 'border-gold-500 bg-gold-500/10' : 'border-ink-900/10 dark:border-paper-100/10'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => setSubmitted(true)} className="btn-primary w-full">Submit Revision Quiz</button>
    </div>
  );
}

export default function Revision() {
  const { progress, loading, advanceRevision } = useProgress();
  const [active, setActive] = useState(null);

  if (loading) return <div className="skeleton h-96 w-full rounded-xl2" />;

  const today = new Date().toISOString().slice(0, 10);
  const schedule = progress.revisionSchedule || [];
  const due = schedule.filter((r) => r.dueDate <= today);
  const upcoming = schedule.filter((r) => r.dueDate > today).sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  async function handleComplete(item) {
    await advanceRevision(item.lessonId);
    setActive(null);
  }

  return (
    <div>
      <Topbar title="Revision" subtitle={`Spaced repetition: Day ${REVISION_INTERVALS_DAYS.join(' → ')}`} />

      {active ? (
        <div className="glass-card p-6">
          <p className="font-semibold mb-4">Revising: {active.topics.join(', ')}</p>
          <RevisionQuiz item={active} onDone={() => handleComplete(active)} />
        </div>
      ) : (
        <>
          <div className="glass-card p-5 mb-6">
            <p className="font-semibold mb-3 flex items-center gap-2"><MdReplay className="text-gold-500" /> Due Today ({due.length})</p>
            {due.length === 0 && <p className="text-sm text-ink-500">No revisions due today. Nice work staying on schedule.</p>}
            <div className="space-y-2">
              {due.map((item) => (
                <div key={item.lessonId} className="flex items-center justify-between bg-gold-500/5 border border-gold-500/20 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{item.topics.join(', ')}</p>
                    <p className="text-xs text-ink-500">Stage {item.stage + 1} of {REVISION_INTERVALS_DAYS.length} · Quick notes + flashcards + 10Q quiz</p>
                  </div>
                  <button onClick={() => setActive(item)} className="btn-primary text-sm px-4 py-2">Start</button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <p className="font-semibold mb-3 flex items-center gap-2"><MdSchedule className="text-ink-500" /> Upcoming Revisions</p>
            {upcoming.length === 0 && <p className="text-sm text-ink-500">Nothing scheduled yet — complete lessons to build your revision queue.</p>}
            <div className="space-y-2">
              {upcoming.slice(0, 10).map((item) => (
                <div key={item.lessonId} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-ink-900/[0.03] dark:bg-paper-100/[0.03]">
                  <p className="text-sm">{item.topics.join(', ')}</p>
                  <span className="text-xs font-mono text-ink-500">{item.dueDate}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
