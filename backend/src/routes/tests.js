import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { generateMockTest, generateRevisionQuiz } from '../services/openaiService.js';

const router = Router();

router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { title, topics, track, count } = req.body;
    if (!title || !topics) return res.status(400).json({ message: 'title and topics are required' });
    const result = await generateMockTest({ title, topics, track, count });
    res.json(result);
  } catch (err) {
    console.error('[tests/generate]', err);
    res.status(500).json({ message: 'Failed to generate mock test' });
  }
});

router.post('/revision-quiz', requireAuth, async (req, res) => {
  try {
    const { topics, count } = req.body;
    if (!topics) return res.status(400).json({ message: 'topics are required' });
    const result = await generateRevisionQuiz({ topics, count });
    res.json(result);
  } catch (err) {
    console.error('[tests/revision-quiz]', err);
    res.status(500).json({ message: 'Failed to generate revision quiz' });
  }
});

export default router;
