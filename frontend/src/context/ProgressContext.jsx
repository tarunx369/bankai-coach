import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { REVISION_INTERVALS_DAYS } from '../data/roadmap';

const ProgressContext = createContext(null);

const DEFAULT_PROGRESS = {
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  completedLessons: [],
  studyHoursTotal: 0,
  testsCompleted: 0,
  averageAccuracy: 0,
  totalQuestions: 0,
  correctQuestions: 0,
  topicAccuracy: {}, // { topicName: { correct, total } }
  revisionSchedule: [], // { lessonId, topics, stage, dueDate }
  dailyLog: {}, // { 'YYYY-MM-DD': minutesStudied }
};

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress(DEFAULT_PROGRESS);
      setLoading(false);
      return;
    }
    const ref = doc(db, 'user_progress', user.uid);
    const unsub = onSnapshot(ref, async (snap) => {
      if (!snap.exists()) {
        await setDoc(ref, DEFAULT_PROGRESS);
        setProgress(DEFAULT_PROGRESS);
      } else {
        setProgress({ ...DEFAULT_PROGRESS, ...snap.data() });
      }
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const todayStr = () => new Date().toISOString().slice(0, 10);

  const bumpStreak = useCallback((current) => {
    const today = todayStr();
    if (current.lastStudyDate === today) return { streak: current.streak, lastStudyDate: today };
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const newStreak = current.lastStudyDate === yesterday ? current.streak + 1 : 1;
    return { streak: newStreak, lastStudyDate: today };
  }, []);

  const completeLesson = useCallback(async (lesson) => {
    if (!user) return;
    const ref = doc(db, 'user_progress', user.uid);
    const { streak, lastStudyDate } = bumpStreak(progress);
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + REVISION_INTERVALS_DAYS[0]);
    const revisionEntry = {
      lessonId: lesson.id,
      topics: lesson.topics,
      stage: 0,
      dueDate: nextDue.toISOString().slice(0, 10),
    };
    await updateDoc(ref, {
      xp: increment(50),
      streak,
      longestStreak: Math.max(progress.longestStreak, streak),
      lastStudyDate,
      completedLessons: arrayUnion(lesson.id),
      revisionSchedule: arrayUnion(revisionEntry),
    });
  }, [user, progress, bumpStreak]);

  const recordTestResult = useCallback(async ({ correct, total, topicBreakdown }) => {
    if (!user) return;
    const ref = doc(db, 'user_progress', user.uid);
    const newTopicAccuracy = { ...progress.topicAccuracy };
    Object.entries(topicBreakdown || {}).forEach(([topic, stat]) => {
      const prev = newTopicAccuracy[topic] || { correct: 0, total: 0 };
      newTopicAccuracy[topic] = { correct: prev.correct + stat.correct, total: prev.total + stat.total };
    });
    const newTotalQ = progress.totalQuestions + total;
    const newCorrectQ = progress.correctQuestions + correct;
    await updateDoc(ref, {
      testsCompleted: increment(1),
      totalQuestions: newTotalQ,
      correctQuestions: newCorrectQ,
      averageAccuracy: newTotalQ > 0 ? Math.round((newCorrectQ / newTotalQ) * 100) : 0,
      topicAccuracy: newTopicAccuracy,
      xp: increment(Math.round((correct / Math.max(total, 1)) * 30)),
    });
  }, [user, progress]);

  const addStudyMinutes = useCallback(async (minutes) => {
    if (!user) return;
    const ref = doc(db, 'user_progress', user.uid);
    const today = todayStr();
    const dailyLog = { ...progress.dailyLog, [today]: (progress.dailyLog[today] || 0) + minutes };
    await updateDoc(ref, { studyHoursTotal: increment(minutes / 60), dailyLog });
  }, [user, progress]);

  const advanceRevision = useCallback(async (lessonId) => {
    if (!user) return;
    const ref = doc(db, 'user_progress', user.uid);
    const schedule = progress.revisionSchedule || [];
    const idx = schedule.findIndex((r) => r.lessonId === lessonId);
    if (idx === -1) return;
    const item = schedule[idx];
    const nextStage = item.stage + 1;
    const updated = [...schedule];
    if (nextStage >= REVISION_INTERVALS_DAYS.length) {
      updated.splice(idx, 1); // revision cycle complete
    } else {
      const nextDue = new Date();
      nextDue.setDate(nextDue.getDate() + REVISION_INTERVALS_DAYS[nextStage]);
      updated[idx] = { ...item, stage: nextStage, dueDate: nextDue.toISOString().slice(0, 10) };
    }
    await updateDoc(ref, { revisionSchedule: updated, xp: increment(10) });
  }, [user, progress]);

  return (
    <ProgressContext.Provider
      value={{ progress, loading, completeLesson, recordTestResult, addStudyMinutes, advanceRevision }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
