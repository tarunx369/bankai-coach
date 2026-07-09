import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { MdTimer, MdArrowBack, MdArrowForward } from 'react-icons/md';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { api } from '../lib/api';
import { getLessonById } from '../data/progressUtils';
import Topbar from '../components/Topbar';
import { SkeletonBlock } from '../components/Skeleton';

const TEST_DURATION_SEC = 20 * 60; // 20 questions, ~1 min each

export default function MockTest() {
  const { lessonId } = useParams();
  const { user } = useAuth();
  const { recordTestResult } = useProgress();
  const navigate = useNavigate();
  const lesson = getLessonById(lessonId);

  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SEC);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!lesson) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.generateMockTest({
          lessonId: lesson.id,
          title: lesson.title,
          topics: lesson.topics,
          track: lesson.track,
          count: 20,
        });
        if (!cancelled) setQuestions(res.questions);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not generate mock test.');
      }
    })();
    return () => { cancelled = true; };
  }, [lesson]);

  const handleSubmit = useCallback(async () => {
    if (!questions || submitted) return;
    setSubmitted(true);
    let correct = 0;
    const topicBreakdown = {};
    const detailedAnswers = questions.map((q, i) => {
      const chosen = answers[i];
      const isCorrect = chosen === q.correctIndex;
      if (isCorrect) correct += 1;
      const topic = q.topic || lesson.title;
      topicBreakdown[topic] = topicBreakdown[topic] || { correct: 0, total: 0 };
      topicBreakdown[topic].total += 1;
      if (isCorrect) topicBreakdown[topic].correct += 1;
      return { ...q, chosen, isCorrect };
    });
    const total = questions.length;
    const wrongCount = total - correct;
    const rawScore = negativeMarking ? correct - wrongCount * 0.25 : correct;

    const resultPayload = {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      total,
      correct,
      wrong: wrongCount,
      score: Math.max(0, rawScore),
      accuracy: Math.round((correct / total) * 100),
      timeTakenSec: TEST_DURATION_SEC - timeLeft,
      negativeMarking,
      topicBreakdown,
      answers: detailedAnswers,
      createdAt: Date.now(),
    };

    if (user) {
      await addDoc(collection(db, 'mock_tests'), { uid: user.uid, ...resultPayload, createdAt: serverTimestamp() });
    }
    await recordTestResult({ correct, total, topicBreakdown });
    navigate(`/result/${lesson.id}`, { state: resultPayload });
  }, [questions, answers, negativeMarking, timeLeft, lesson, user, recordTestResult, navigate, submitted]);

  useEffect(() => {
    if (!questions || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, questions, submitted, handleSubmit]);

  if (!lesson) return <p>Lesson not found.</p>;
  if (error) return <p className="text-coral-500">{error}</p>;
  if (!questions) {
    return (
      <div>
        <Topbar title="Preparing your mock test…" subtitle={lesson.title} />
        <div className="space-y-3">
          <SkeletonBlock className="h-24 w-full" />
          <SkeletonBlock className="h-24 w-full" />
        </div>
      </div>
    );
  }

  const q = questions[current];
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  return (
    <div>
      <Topbar title="Mock Test" subtitle={`${lesson.title} · Question ${current + 1} of ${questions.length}`} />

      <div className="flex items-center justify-between mb-4">
        <div className="glass-card-sm px-3 py-2 flex items-center gap-2 font-mono font-bold text-gold-600 dark:text-gold-400">
          <MdTimer /> {mins}:{secs}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={negativeMarking} onChange={(e) => setNegativeMarking(e.target.checked)} />
          Negative marking
        </label>
      </div>

      <div className="glass-card p-6 mb-4">
        <span className="badge bg-gold-500/15 text-gold-600 dark:text-gold-400 mb-3">{q.difficulty || 'Medium'} · {q.type || 'MCQ'}</span>
        <p className="font-semibold mb-4">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswers((a) => ({ ...a, [current]: i }))}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                answers[current] === i
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-ink-900/10 dark:border-paper-100/10 hover:border-gold-500/40'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} className="btn-secondary">
          <MdArrowBack /> Previous
        </button>
        {current < questions.length - 1 ? (
          <button onClick={() => setCurrent((c) => c + 1)} className="btn-primary">
            Next <MdArrowForward />
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary">Submit Test</button>
        )}
      </div>

      <div className="grid grid-cols-10 gap-1.5 mt-6">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-8 rounded-lg text-xs font-mono ${
              i === current ? 'bg-gold-500 text-ink-950' : answers[i] !== undefined ? 'bg-mint-500/30' : 'bg-ink-900/5 dark:bg-paper-100/10'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
