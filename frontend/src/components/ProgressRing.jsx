export default function ProgressRing({ percent = 0, size = 96, stroke = 10, label }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} className="stroke-ink-900/10 dark:stroke-paper-100/10" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stroke-gold-500 transition-all duration-700 ease-out"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono font-bold text-lg">{Math.round(percent)}%</span>
        {label && <span className="text-[10px] text-ink-500 dark:text-paper-200/60">{label}</span>}
      </div>
    </div>
  );
}
