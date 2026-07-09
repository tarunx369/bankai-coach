# BankAI Coach

Personal AI-powered tutor for SBI PO & IBPS PO preparation, built per the SRS: a
React (Vite + Tailwind + Framer Motion + Recharts) frontend, a Node/Express
backend that calls the Groq API, and Firebase (Auth + Firestore) for data
that persists across sessions. Single-user app — no multi-user system.

## What's implemented (mapped to the SRS modules)

1. **Dashboard** — streak, XP, level, study hours, completion, weak/strong topic, charts
2. **Learning Roadmap** — Weeks → Days → Topics, only the next lesson unlocks (Banking + Computer tracks)
3. **AI Lesson Generator** — full Markdown lesson per topic, cached in Firestore after first generation
4. **Mock Test** — 20 AI-generated questions, timer, difficulty mix, optional negative marking
5. **Result Analysis** — score, accuracy, topic/difficulty breakdown, AI explanations for wrong answers
6. **Progress Tracker** — daily/weekly/monthly study time, accuracy, streaks, all permanently stored
7. **Revision Module** — Day 1/2/4/7/15/30 spaced repetition queue with a 10-question quiz per stage
8. **Flashcards** — auto-generated per completed lesson, 3D flip, mark known/unknown
9. **AI Doubt Solver** — ask anything, get definition/explanation/example/shortcut/memory trick/exam tip
10. **Current Affairs** — daily categorized summaries, cached per date
11. **Search** — global search across the roadmap's topics/terms
12. **Notes** — free-form notes + lesson bookmarks
13. **Settings** — dark/light mode, daily goal, reminder time, export/reset progress

## Before you deploy — what you must supply

This app cannot run with placeholder data. You need your own:

1. **A Firebase project** (Auth + Firestore) — free tier is enough for personal use.
2. **A Groq API key** — from https://console.groq.com/keys — Groq has a genuine
   free tier (no card required to start), which is why this app uses it. Every
   lesson, mock test, flashcard set, doubt answer, and current affairs digest is
   a real API call; keep an eye on Groq's free-tier rate limits if you use this
   heavily in a single day.

## 1. Firebase setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → Create project.
2. **Authentication** → Sign-in method → enable **Google** and **Email/Password**.
3. **Firestore Database** → Create database (production mode, any region).
4. Deploy the included security rules and indexes (or paste `firestore.rules` into
   the Firestore console's Rules tab manually):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore   # point it at this folder, keep existing rules/indexes files
   firebase deploy --only firestore:rules,firestore:indexes
   ```
5. **Project Settings → General → Your apps → Web app** — copy the config values
   into `frontend/.env` (see step 2 below).
6. **Project Settings → Service accounts** → Generate new private key. Open the
   downloaded JSON and copy `project_id`, `client_email`, and `private_key` into
   `backend/.env` (see step 3 below).

## 2. Frontend setup

```bash
cd frontend
cp .env.example .env
# fill in VITE_FIREBASE_* from Firebase console, and VITE_API_BASE_URL
npm install
npm run dev      # http://localhost:5173
```

## 3. Backend setup

```bash
cd backend
cp .env.example .env
# fill in GROQ_API_KEY and the FIREBASE_* service account fields
npm install
npm run dev       # http://localhost:5000
```

`FIREBASE_PRIVATE_KEY` must keep its `\n` escapes and be wrapped in quotes, exactly
as it appears in the downloaded service account JSON.

Once both are running, log in (Google or email) in the frontend — this creates
your single user document automatically.

## 4. Deploying

This mirrors how FlowDesk was deployed — frontend on Vercel, backend on Render.

**Backend → Render**
- New Web Service → connect the `backend/` folder (root directory: `backend`)
- Build command: `npm install` · Start command: `npm start`
- Add the same environment variables from `backend/.env` in Render's dashboard
- Set `CLIENT_URL` to your deployed Vercel URL (not `localhost`) — this is what
  broke CORS on FlowDesk last time, so double-check it has no trailing slash

**Frontend → Vercel**
- New Project → root directory: `frontend`
- Framework preset: Vite · Build command: `npm run build` · Output dir: `dist`
- Add the `VITE_*` environment variables from `frontend/.env`, with
  `VITE_API_BASE_URL` pointing at your Render backend's `/api` path

**Firebase Auth**: add your Vercel domain to
Authentication → Settings → Authorized domains, or Google sign-in will fail in production.

## Notes on things you'll want to adjust

- **Study reminders** (Settings module) save a preferred time but there's no
  notification delivery wired up — the SRS doesn't specify a channel (no Telegram
  bot like FlowDesk). Cheapest path: a Render cron job that hits a small
  `/api/reminder` endpoint you add, or a browser-based Notification API prompt.
- **Current affairs accuracy**: the model has a training cutoff and no live news
  feed, so it's told to label anything it's not certain about as illustrative
  rather than fabricate real headlines. For genuinely current news you'd want to
  wire in a news API — happy to add that if you want it.
- **Costs**: lesson/flashcard/current-affairs generations are cached in Firestore
  after the first request per day/lesson, so repeat visits don't re-spend tokens.
  Mock tests and revision quizzes regenerate every time by design (SRS: "no
  repeated questions unless revision mode").
