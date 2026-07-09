import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { MdCheckCircle, MdCancel, MdArrowBack } from 'react-icons/md';
import Topbar from '../components/Topbar';
import ProgressRing from '../components/ProgressRing';
import { getLessonById } from '../data/progressUtils';

export default function ResultAnalysis() {
  const { lessonId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const lesson = getLessonById(lessonId);

  if (!state) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="mb-4">No fresh result to show. Results are only available right after finishing a test.</p>
        <Link to="/roadmap" className="btn-primary">Back to Roadmap</Link>
      </div>
    );
  }

  const { total, correct, wrong, score, accuracy, timeTakenSec, topicBreakdown, answers, negativeMarking } = state;

  const difficultyBreakdown = {};
  answers.forEach((a) => {
    const d = a.difficulty || 'Medium';
    difficultyBreakdown[d] = difficultyBreakdown[d] || { correct: 0, total: 0 };
    difficultyBreakdown[d].total += 1;
    if (a.isCorrect) difficultyBreakdown[d].correct += 1;
  });

  const confidence = Math.round((accuracy * 0.7) + ((total - wrong) / total) * 30);
  const mins = Math.floor(timeTakenSec / 60);
  const secs = timeTakenSec % 60;

  const weakTopics = Object.entries(topicBreakdown).filter(([, v]) => v.correct / v.total < 0.6).map(([t]) => t);
  const strongTopics = Object.entries(topicBreakdown).filter(([, v]) => v.correct / v.total >= 0.8).map(([t]) => t);

  return (
    <div>
      <button onClick={() => navigate('/roadmap')} className="flex items-center gap-1 text-sm text-ink-500 dark:text-paper-200/60 mb-4 hover:text-gold-500">
        <MdArrowBack /> Back to roadmap
      </button>
      <Topbar title="Result Analysis" subtitle={lesson?.title} />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-6 flex items-center gap-4 md:col-span-1">
          <ProgressRing percent={accuracy} label="Accuracy" />
          <div>
            <p className="text-2xl font-mono font-bold">{score.toFixed(2)}<span className="text-sm text-ink-500">/{total}</span></p>
            <p className="text-xs text-ink-500 dark:text-paper-200/60">Score {negativeMarking && '(negative marking on)'}</p>
          </div>
        </div>
        <div className="glass-card p-6 md:col-span-2 grid grid-cols-3 gap-4 text-center">
          <div><p className="font-mono font-bold text-xl text-mint-500">{correct}</p><p className="text-xs text-ink-500">Correct</p></div>
          <div><p className="font-mono font-bold text-xl text-coral-500">{wrong}</p><p className="text-xs text-ink-500">Wrong</p></div>
          <div><p className="font-mono font-bold text-xl">{mins}m {secs}s</p><p className="text-xs text-ink-500">Time Taken</p></div>
          <div className="col-span-3 mt-2">
            <p className="text-xs text-ink-500 mb-1">Confidence Score</p>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${confidence}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-5">
          <p className="font-semibold mb-3">Topic-wise Performance</p>
          {Object.entries(topicBreakdown).map(([topic, v]) => (
            <div key={topic} className="mb-2">
              <div className="flex justify-between text-xs mb-1"><span>{topic}</span><span className="font-mono">{v.correct}/{v.total}</span></div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${(v.correct / v.total) * 100}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="glass-card p-5">
          <p className="font-semibold mb-3">Difficulty-wise Performance</p>
          {Object.entries(difficultyBreakdown).map(([diff, v]) => (
            <div key={diff} className="mb-2">
              <div className="flex justify-between text-xs mb-1"><span>{diff}</span><span className="font-mono">{v.correct}/{v.total}</span></div>
              <div className="progress-track"><div className="progress-fill bg-gradient-to-r from-mint-500 to-mint-400" style={{ width: `${(v.correct / v.total) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5 mb-6">
        <p className="font-semibold mb-2">Improvement Suggestions</p>
        {weakTopics.length > 0 ? (
          <p className="text-sm text-ink-700 dark:text-paper-100/80">
            Focus revision time on: <span className="font-semibold text-coral-500">{weakTopics.join(', ')}</span>.
            {strongTopics.length > 0 && <> You've mastered <span className="font-semibold text-mint-500">{strongTopics.join(', ')}</span> — keep it in light revision only.</>}
          </p>
        ) : (
          <p className="text-sm text-mint-500 font-medium">Strong performance across all topics in this test. Move on to the next lesson.</p>
        )}
      </div>

      <div className="glass-card p-5">
        <p className="font-semibold mb-4">Answer Review</p>
        <div className="space-y-4">
          {answers.map((a, i) => (
            <div key={i} className={`p-4 rounded-xl border ${a.isCorrect ? 'border-mint-500/30 bg-mint-500/5' : 'border-coral-500/30 bg-coral-500/5'}`}>
              <div className="flex items-start gap-2 mb-2">
                {a.isCorrect ? <MdCheckCircle className="text-mint-500 shrink-0 mt-0.5" /> : <MdCancel className="text-coral-500 shrink-0 mt-0.5" />}
                <p className="text-sm font-medium">{i + 1}. {a.question}</p>
              </div>
              {!a.isCorrect && (
                <p className="text-xs text-ink-500 dark:text-paper-200/60 mb-1">
                  Your answer: {a.chosen !== undefined ? a.options[a.chosen] : 'Not answered'} · Correct: {a.options[a.correctIndex]}
                </p>
              )}
              {a.explanation && (
                <div className="text-xs text-ink-700 dark:text-paper-100/70 mt-2 prose prose-xs dark:prose-invert max-w-none">
                  <ReactMarkdown>{a.explanation}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
