import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdEmail, MdLock } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleGoogle() {
    setError(''); setBusy(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      if (mode === 'login') await loginWithEmail(email, password);
      else await registerWithEmail(email, password);
      navigate('/');
    } catch (e2) {
      setError(e2.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-50 dark:bg-ink-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-full max-w-sm p-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center font-display font-bold text-ink-950">B</div>
          <div>
            <p className="font-display font-bold leading-tight">BankAI Coach</p>
            <p className="text-xs text-ink-500 dark:text-paper-200/60">Your personal SBI/IBPS PO tutor</p>
          </div>
        </div>

        <button onClick={handleGoogle} disabled={busy} className="btn-secondary w-full mb-4">
          <FcGoogle size={20} /> Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4 text-xs text-ink-500 dark:text-paper-200/60">
          <div className="flex-1 h-px bg-ink-900/10 dark:bg-paper-100/10" />
          or
          <div className="flex-1 h-px bg-ink-900/10 dark:bg-paper-100/10" />
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div className="relative">
            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" size={18} />
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/60 dark:bg-ink-700/50 border border-ink-900/10 dark:border-paper-100/10 outline-none focus:border-gold-500 text-sm"
            />
          </div>
          <div className="relative">
            <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" size={18} />
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/60 dark:bg-ink-700/50 border border-ink-900/10 dark:border-paper-100/10 outline-none focus:border-gold-500 text-sm"
            />
          </div>
          {error && <p className="text-coral-500 text-xs">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}
          className="text-xs text-ink-500 dark:text-paper-200/60 mt-4 w-full text-center hover:text-gold-500"
        >
          {mode === 'login' ? "First time here? Create your account" : 'Already have an account? Log in'}
        </button>
      </motion.div>
    </div>
  );
}
