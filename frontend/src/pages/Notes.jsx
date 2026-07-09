import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { MdAdd, MdDelete, MdBookmark } from 'react-icons/md';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Topbar from '../components/Topbar';

export default function Notes() {
  const { user } = useAuth();
  const [tab, setTab] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (!user) return;
    const qNotes = query(collection(db, 'notes'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsub1 = onSnapshot(qNotes, (snap) => setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const qBookmarks = query(collection(db, 'bookmarks'), where('uid', '==', user.uid));
    const unsub2 = onSnapshot(qBookmarks, (snap) => setBookmarks(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => { unsub1(); unsub2(); };
  }, [user]);

  async function addNote(e) {
    e.preventDefault();
    if (!body.trim()) return;
    await addDoc(collection(db, 'notes'), {
      uid: user.uid, title: title.trim() || 'Untitled note', body: body.trim(), createdAt: serverTimestamp(),
    });
    setTitle(''); setBody('');
  }

  async function removeNote(id) {
    await deleteDoc(doc(db, 'notes', id));
  }

  return (
    <div>
      <Topbar title="Notes" subtitle="Write notes, bookmark lessons, and favorite topics" />

      <div className="flex gap-2 mb-6">
        {['notes', 'bookmarks'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === t ? 'bg-gold-500 text-ink-950' : 'glass-card-sm'}`}
          >
            {t === 'notes' ? 'My Notes' : 'Bookmarks'}
          </button>
        ))}
      </div>

      {tab === 'notes' ? (
        <div>
          <form onSubmit={addNote} className="glass-card p-4 mb-6 space-y-2">
            <input
              value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title"
              className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-ink-700/50 border border-ink-900/10 dark:border-paper-100/10 outline-none text-sm"
            />
            <textarea
              value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your note…" rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-ink-700/50 border border-ink-900/10 dark:border-paper-100/10 outline-none text-sm resize-none"
            />
            <button type="submit" className="btn-primary text-sm"><MdAdd /> Add Note</button>
          </form>

          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="glass-card-sm p-4">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-sm">{n.title}</p>
                  <button onClick={() => removeNote(n.id)} className="text-coral-500 hover:scale-110 transition-transform"><MdDelete size={16} /></button>
                </div>
                <p className="text-sm text-ink-700 dark:text-paper-100/70 mt-1 whitespace-pre-wrap">{n.body}</p>
              </div>
            ))}
            {notes.length === 0 && <p className="text-sm text-ink-500">No notes yet.</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {bookmarks.map((b) => (
            <Link key={b.id} to={`/lesson/${b.lessonId}`} className="flex items-center gap-3 glass-card-sm px-4 py-3 hover:border-gold-500/40">
              <MdBookmark className="text-gold-500" />
              <p className="text-sm font-medium">{b.title}</p>
            </Link>
          ))}
          {bookmarks.length === 0 && <p className="text-sm text-ink-500">No bookmarks yet — bookmark a lesson from its page.</p>}
        </div>
      )}
    </div>
  );
}
