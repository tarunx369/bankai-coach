import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import lessonsRouter from './src/routes/lessons.js';
import testsRouter from './src/routes/tests.js';
import flashcardsRouter from './src/routes/flashcards.js';
import doubtRouter from './src/routes/doubt.js';
import currentAffairsRouter from './src/routes/currentAffairs.js';

const app = express();

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: clientUrl }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'bankai-coach-backend' }));

app.use('/api/lessons', lessonsRouter);
app.use('/api/tests', testsRouter);
app.use('/api/flashcards', flashcardsRouter);
app.use('/api/doubt', doubtRouter);
app.use('/api/current-affairs', currentAffairsRouter);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// Centralized error handler as a safety net for anything routes don't catch themselves.
app.use((err, req, res, next) => {
  console.error('[unhandled]', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BankAI Coach backend running on http://localhost:${PORT}`);
  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  GROQ_API_KEY is not set — AI generation endpoints will fail until you add it to backend/.env');
  }
});
