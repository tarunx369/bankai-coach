import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { MdArrowBack, MdQuiz, MdBookmarkBorder, MdBookmark } from 'react-icons/md';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { api } from '../lib/api';
import { getLessonById } from '../data/progressUtils';
import Topbar from '../components/Topbar';
import { SkeletonLesson } from '../components/Skeleton';

export default function Lesson() {
  const { lessonId } = useParams();
  const { user } = useAuth();
  const { completeLesson, addStudyMinutes } = useProgress();
  const navigate = useNavigate();
  const lesson = getLessonById(lessonId);

  const [content, setContent] = useState(null);
  const [error, setError] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!lesson || !user) return;
    let cancelled = false;
    (async () => {
      setContent(null);
      setError('');
      const cacheRef = doc(db, 'daily_lessons', `${user.uid}_${lesson.id}`);
      const cached = await getDoc(cacheRef);
      if (cached.exists()) {
        if (!cancelled) setContent(cached.data().markdown);
        return;
      }
      try {
        const res = await api.generateLesson({
          lessonId: lesson.id,
          title: lesson.title,
          topics: lesson.topics,
          track: lesson.track,
        });
        if (!cancelled) {
          setContent(res.markdown);
          await setDoc(cacheRef, { markdown: res.markdown, createdAt: Date.now() });
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not generate lesson. Check your backend & OpenAI API key.');
      }
    })();
    return () => { cancelled = true; };
  }, [lesson, user]);

  useEffect(() => {
    return () => {
      const minutes = (Date.now() - startTime.current) / 60000;
      if (minutes > 0.2) addStudyMinutes(minutes);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleBookmark() {
    if (!user) return;
    const ref = doc(db, 'bookmarks', `${user.uid}_${lesson.id}`);
    if (!bookmarked) {
      await setDoc(ref, { uid: user.uid, lessonId: lesson.id, title: lesson.title, createdAt: Date.now() });
    }
    setBookmarked((b) => !b);
  }

  async function handleMarkComplete() {
    await completeLesson(lesson);
    navigate(`/test/${lesson.id}`);
  }

  if (!lesson) return <p>Lesson not found.</p>;

  return (
    <div>
      <button onClick={() => navigate('/roadmap')} className="flex items-center gap-1 text-sm text-ink-500 dark:text-paper-200/60 mb-4 hover:text-gold-500">
        <MdArrowBack /> Back to roadmap
      </button>
      <Topbar title={lesson.title} subtitle={`Week ${lesson.week} · Day ${lesson.day} · ${lesson.track === 'banking' ? 'Banking Awareness' : 'Computer Awareness'}`} />

      <div className="glass-card p-6 md:p-8">
        <div className="flex justify-end mb-2">
          <button onClick={toggleBookmark} className="text-gold-500 hover:scale-110 transition-transform" aria-label="Bookmark lesson">
            {bookmarked ? <MdBookmark size={22} /> : <MdBookmarkBorder size={22} />}
          </button>
        </div>

        {error && (
          <div className="text-coral-500 text-sm bg-coral-500/10 rounded-xl p-4">{error}</div>
        )}
        {!error && !content && <SkeletonLesson />}
        {content && (
          <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-gold-500">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        )}
      </div>

      {content && (
        <div className="flex justify-end mt-6">
          <button onClick={handleMarkComplete} className="btn-primary">
            <MdQuiz /> Mark Complete & Take Mock Test
          </button>
        </div>
      )}
    </div>
  );
}
