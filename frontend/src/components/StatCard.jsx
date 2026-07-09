export default function StatCard({ icon: Icon, label, value, accent = 'gold' }) {
  const accentMap = {
    gold: 'text-gold-500',
    mint: 'text-mint-500',
    coral: 'text-coral-500',
  };
  return (
    <div className="glass-card p-4 flex items-center gap-3 animate-rise">
      {Icon && (
        <div className={`w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center ${accentMap[accent]}`}>
          <Icon size={20} className={accentMap[accent]} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-ink-500 dark:text-paper-200/60 truncate">{label}</p>
        <p className="text-xl font-mono font-bold truncate">{value}</p>
      </div>
    </div>
  );
}
