import { flattenRoadmap, ALL_LESSONS } from './roadmap';

// A lesson is unlocked if it's the first not-yet-completed lesson in its track
// (Module 2 rule: "Only today's lesson should be unlocked").
export function getTrackStatus(track, completedLessons = []) {
  const flat = flattenRoadmap(track);
  let nextFound = false;
  return flat.map((lesson) => {
    const isCompleted = completedLessons.includes(lesson.id);
    let status = 'locked';
    if (isCompleted) status = 'completed';
    else if (!nextFound) {
      status = 'unlocked';
      nextFound = true;
    }
    return { ...lesson, status };
  });
}

export function getNextLesson(track, completedLessons = []) {
  const statused = getTrackStatus(track, completedLessons);
  return statused.find((l) => l.status === 'unlocked') || null;
}

export function getLessonById(lessonId) {
  return ALL_LESSONS.find((l) => l.id === lessonId) || null;
}

export function getOverallCompletion(completedLessons = []) {
  const total = ALL_LESSONS.length;
  const done = completedLessons.length;
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

export function getWeakStrongTopics(topicAccuracy = {}) {
  const entries = Object.entries(topicAccuracy)
    .filter(([, v]) => v.total >= 3)
    .map(([topic, v]) => ({ topic, pct: Math.round((v.correct / v.total) * 100) }));
  if (entries.length === 0) return { weakest: null, strongest: null };
  entries.sort((a, b) => a.pct - b.pct);
  return { weakest: entries[0], strongest: entries[entries.length - 1] };
}
