import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import { useProgress } from '../context/ProgressContext';
import { ALL_LESSONS } from '../data/roadmap';
import {
  MdLocalFireDepartment, MdWhatshot, MdCheckCircle, MdQuiz,
  MdTrendingUp, MdSchedule, MdReplay, MdListAlt,
} from 'react-icons/md';

function aggregate(dailyLog, groupBy) {
  const groups = {};
  Object.entries(dailyLog || {}).forEach(([date, minutes]) => {
    const d = new Date(date);
    let key;
    if (groupBy === 'week') {
      const onejan = new Date(d.getFullYear(), 0, 1);
      const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
      key = `W${week}`;
    } else {
      key = date.slice(0, 7);
    }
    groups[key] = (groups[key] || 0) + minutes;
  });
  return Object.entries(groups).map(([key, minutes]) => ({ key, minutes: Math.round(minutes) }));
}

export default function Progress() {
  const { progress, loading } = useProgress();
  if (loading) return <div className="skeleton h-96 w-full rounded-xl2" />;

  const weekly = aggregate(progress.dailyLog, 'week');
  const monthly = aggregate(progress.dailyLog, 'month');
  const revisionCompleted = ALL_LESSONS.length > 0
    ? progress.completedLessons.length - (progress.revisionSchedule || []).length
    : 0;

  return (
    <div>
      <Topbar title="Progress Tracker" subtitle="Every metric, permanently tracked" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={MdLocalFireDepartment} label="Current Streak" value={`${progress.streak} days`} accent="gold" />
        <StatCard icon={MdWhatshot} label="Longest Streak" value={`${progress.longestStreak} days`} accent="gold" />
        <StatCard icon={MdCheckCircle} label="Completed Topics" value={progress.completedLessons.length} accent="mint" />
        <StatCard icon={MdQuiz} label="Completed Tests" value={progress.testsCompleted} accent="mint" />
        <StatCard icon={MdTrendingUp} label="Average Accuracy" value={`${progress.averageAccuracy}%`} accent="mint" />
        <StatCard icon={MdListAlt} label="Total Questions Solved" value={progress.totalQuestions} accent="gold" />
        <StatCard icon={MdSchedule} label="Study Hours" value={progress.studyHoursTotal.toFixed(1)} accent="coral" />
        <StatCard icon={MdReplay} label="Revisions Completed" value={Math.max(0, revisionCompleted)} accent="coral" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <p className="font-semibold mb-3">Weekly Study Time (minutes)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="key" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Bar dataKey="minutes" fill="#E3A542" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-5">
          <p className="font-semibold mb-3">Monthly Study Time (minutes)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="key" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Bar dataKey="minutes" fill="#34D399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard label="Correct Questions" value={progress.correctQuestions} accent="mint" />
        <StatCard label="Wrong Questions" value={progress.totalQuestions - progress.correctQuestions} accent="coral" />
        <StatCard label="Overall Completion" value={`${ALL_LESSONS.length ? Math.round((progress.completedLessons.length / ALL_LESSONS.length) * 100) : 0}%`} accent="gold" />
        <StatCard label="Pending Revisions" value={(progress.revisionSchedule || []).length} accent="coral" />
      </div>
    </div>
  );
}
