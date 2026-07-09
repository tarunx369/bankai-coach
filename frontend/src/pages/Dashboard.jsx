import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdLocalFireDepartment, MdStar, MdSchedule, MdCheckCircle, MdPending,
  MdReplay, MdTrendingUp, MdTrendingDown,
} from 'react-icons/md';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import { useProgress } from '../context/ProgressContext';
import { ALL_LESSONS } from '../data/roadmap';
import { getNextLesson, getOverallCompletion, getWeakStrongTopics } from '../data/progressUtils';

export default function Dashboard() {
  const { progress, loading } = useProgress();

  if (loading) return <div className="skeleton h-96 w-full rounded-xl2" />;

  const bankingNext = getNextLesson('banking', progress.completedLessons);
  const computerNext = getNextLesson('computer', progress.completedLessons);
  const overallCompletion = getOverallCompletion(progress.completedLessons);
  const { weakest, strongest } = getWeakStrongTopics(progress.topicAccuracy);
  const revisionDueToday = (progress.revisionSchedule || []).filter(
    (r) => r.dueDate <= new Date().toISOString().slice(0, 10)
  );

  const dailyData = Object.entries(progress.dailyLog || {})
    .slice(-7)
    .map(([date, minutes]) => ({ date: date.slice(5), minutes }));

  const topicData = Object.entries(progress.topicAccuracy || {})
    .slice(-8)
    .map(([topic, v]) => ({ topic: topic.length > 12 ? topic.slice(0, 12) + '…' : topic, accuracy: Math.round((v.correct / v.total) * 100) }));

  return (
    <div>
      <Topbar title="Dashboard" subtitle="Here's where you stand today" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={MdLocalFireDepartment} label="Study Streak" value={`${progress.streak} days`} accent="gold" />
        <StatCard icon={MdStar} label="XP · Level" value={`${progress.xp} · Lv${progress.level}`} accent="gold" />
        <StatCard icon={MdSchedule} label="Study Hours" value={progress.studyHoursTotal.toFixed(1)} accent="mint" />
        <StatCard icon={MdCheckCircle} label="Topics Completed" value={`${progress.completedLessons.length}/${ALL_LESSONS.length}`} accent="mint" />
        <StatCard icon={MdPending} label="Remaining Topics" value={ALL_LESSONS.length - progress.completedLessons.length} accent="coral" />
        <StatCard icon={MdReplay} label="Revision Due Today" value={revisionDueToday.length} accent="coral" />
        <StatCard icon={MdTrendingUp} label="Avg Accuracy" value={`${progress.averageAccuracy}%`} accent="mint" />
        <StatCard icon={MdTrendingUp} label="Overall Completion" value={`${overallCompletion}%`} accent="gold" />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {[
          { label: 'Banking Awareness', next: bankingNext, track: 'banking' },
          { label: 'Computer Awareness', next: computerNext, track: 'computer' },
        ].map(({ label, next, track }) => (
          <motion.div key={track} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <p className="text-xs uppercase tracking-wide text-ink-500 dark:text-paper-200/60 mb-1">{label} · Today's Topic</p>
            {next ? (
              <>
                <h3 className="text-lg font-bold mb-1">{next.title}</h3>
                <p className="text-xs text-ink-500 dark:text-paper-200/60 mb-4">Week {next.week} · Day {next.day}</p>
                <Link to={`/lesson/${next.id}`} className="btn-primary">Start Lesson</Link>
              </>
            ) : (
              <p className="text-mint-500 font-semibold py-4">Track complete! 🎉</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-5">
          <p className="font-semibold mb-3 flex items-center gap-2"><MdTrendingDown className="text-coral-500" /> Weakest Topic</p>
          {weakest ? (
            <div>
              <p className="text-lg font-bold">{weakest.topic}</p>
              <div className="progress-track mt-2"><div className="progress-fill bg-coral-500" style={{ width: `${weakest.pct}%` }} /></div>
              <p className="text-xs font-mono mt-1">{weakest.pct}% accuracy</p>
            </div>
          ) : <p className="text-sm text-ink-500">Complete a few mock tests to see this.</p>}
        </div>
        <div className="glass-card p-5">
          <p className="font-semibold mb-3 flex items-center gap-2"><MdTrendingUp className="text-mint-500" /> Strongest Topic</p>
          {strongest ? (
            <div>
              <p className="text-lg font-bold">{strongest.topic}</p>
              <div className="progress-track mt-2"><div className="progress-fill" style={{ width: `${strongest.pct}%` }} /></div>
              <p className="text-xs font-mono mt-1">{strongest.pct}% accuracy</p>
            </div>
          ) : <p className="text-sm text-ink-500">Complete a few mock tests to see this.</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <p className="font-semibold mb-3">Study Time (last 7 days)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Line type="monotone" dataKey="minutes" stroke="#E3A542" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-5">
          <p className="font-semibold mb-3">Topic-wise Accuracy</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topicData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="topic" fontSize={10} />
              <YAxis fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Bar dataKey="accuracy" fill="#34D399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
