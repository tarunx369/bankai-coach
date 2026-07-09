import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { addDoc, collection, serverTimestamp, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { MdSend } from 'react-icons/md';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import Topbar from '../components/Topbar';

export default function DoubtSolver() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'ai_chat_history'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(30)
    );
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => d.data()).reverse();
      setMessages(items);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleAsk(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || busy) return;
    setInput('');
    setBusy(true);
    setMessages((m) => [...m, { question, answer: null, pending: true }]);
    try {
      const res = await api.askDoubt({ question });
      if (user) {
        await addDoc(collection(db, 'ai_chat_history'), {
          uid: user.uid, question, answer: res.markdown, createdAt: serverTimestamp(),
        });
      } else {
        setMessages((m) => m.map((msg) => (msg.pending ? { question, answer: res.markdown } : msg)));
      }
    } catch (err) {
      setMessages((m) => m.map((msg) => (msg.pending ? { question, answer: `_Error: ${err.message}_` } : msg)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Topbar title="Ask Doubt" subtitle='e.g. "What is Repo Rate?"' />

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.length === 0 && (
          <p className="text-sm text-ink-500">Ask anything from Banking or Computer Awareness. You'll get a definition, explanation, example, shortcut, memory trick, and exam tip.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-end">
              <div className="bg-gold-500 text-ink-950 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm max-w-md font-medium">{m.question}</div>
            </div>
            <div className="flex justify-start">
              <div className="glass-card-sm px-4 py-3 text-sm max-w-lg prose prose-sm dark:prose-invert prose-headings:text-sm">
                {m.answer ? <ReactMarkdown>{m.answer}</ReactMarkdown> : <span className="animate-pulseSoft">Thinking…</span>}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your doubt…"
          className="flex-1 px-4 py-3 rounded-xl bg-white/60 dark:bg-ink-700/50 border border-ink-900/10 dark:border-paper-100/10 outline-none focus:border-gold-500 text-sm"
        />
        <button type="submit" disabled={busy} className="btn-primary px-4"><MdSend /></button>
      </form>
    </div>
  );
}
