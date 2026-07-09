import { useState } from 'react';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { MdDownload, MdRestartAlt, MdDarkMode, MdLightMode } from 'react-icons/md';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import Topbar from '../components/Topbar';

export default function Settings() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const { theme, setTheme } = useTheme();
  const [dailyGoal, setDailyGoal] = useState(60);
  const [reminderTime, setReminderTime] = useState('19:00');
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  async function saveSettings() {
    await updateDoc(doc(db, 'users', user.uid), { dailyGoalMinutes: dailyGoal, reminderTime, theme });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bankai-coach-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function resetProgress() {
    await setDoc(doc(db, 'user_progress', user.uid), {
      xp: 0, level: 1, streak: 0, longestStreak: 0, lastStudyDate: null,
      completedLessons: [], studyHoursTotal: 0, testsCompleted: 0, averageAccuracy: 0,
      totalQuestions: 0, correctQuestions: 0, topicAccuracy: {}, revisionSchedule: [], dailyLog: {},
    });
    setConfirmReset(false);
  }

  return (
    <div className="max-w-xl">
      <Topbar title="Settings" />

      <div className="glass-card p-5 mb-4">
        <p className="font-semibold mb-3">Appearance</p>
        <div className="flex gap-2">
          <button onClick={() => setTheme('light')} className={`btn-secondary flex-1 ${theme === 'light' ? 'border-gold-500 text-gold-600' : ''}`}>
            <MdLightMode /> Light
          </button>
          <button onClick={() => setTheme('dark')} className={`btn-secondary flex-1 ${theme === 'dark' ? 'border-gold-500 text-gold-400' : ''}`}>
            <MdDarkMode /> Dark
          </button>
        </div>
      </div>

      <div className="glass-card p-5 mb-4 space-y-4">
        <p className="font-semibold">Study Preferences</p>
        <div>
          <label className="text-xs text-ink-500 dark:text-paper-200/60">Daily goal (minutes)</label>
          <input
            type="number" min={10} step={5} value={dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-white/60 dark:bg-ink-700/50 border border-ink-900/10 dark:border-paper-100/10 outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-ink-500 dark:text-paper-200/60">Daily study reminder</label>
          <input
            type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-white/60 dark:bg-ink-700/50 border border-ink-900/10 dark:border-paper-100/10 outline-none text-sm"
          />
          <p className="text-xs text-ink-500 mt-1">Reminders require a notification/cron job on your deployment — see README.</p>
        </div>
        <button onClick={saveSettings} className="btn-primary text-sm">Save Settings</button>
        {saved && <span className="text-mint-500 text-xs ml-2">Saved ✓</span>}
      </div>

      <div className="glass-card p-5 mb-4">
        <p className="font-semibold mb-3">Data</p>
        <button onClick={exportProgress} className="btn-secondary w-full mb-2"><MdDownload /> Export Progress (JSON)</button>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="btn-secondary w-full text-coral-500 border-coral-500/30">
            <MdRestartAlt /> Reset Progress
          </button>
        ) : (
          <div className="text-center">
            <p className="text-xs text-coral-500 mb-2">This permanently erases XP, streak, and completed lessons. Are you sure?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmReset(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={resetProgress} className="btn-primary flex-1 !bg-coral-500 text-white">Yes, reset</button>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card p-5">
        <p className="font-semibold mb-2">API Settings</p>
        <p className="text-xs text-ink-500 dark:text-paper-200/60">
          The Groq API key is configured server-side in the backend's <code>.env</code> file and is never exposed to the browser. Update it there and restart the backend to change it.
        </p>
      </div>
    </div>
  );
}
