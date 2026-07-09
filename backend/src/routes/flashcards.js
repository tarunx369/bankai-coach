import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { generateFlashcards } from '../services/openaiService.js';

const router = Router();

router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { title, topics } = req.body;
    if (!title || !topics) return res.status(400).json({ message: 'title and topics are required' });
    const result = await generateFlashcards({ title, topics });
    res.json(result);
  } catch (err) {
    console.error('[flashcards/generate]', err);
    res.status(500).json({ message: 'Failed to generate flashcards' });
  }
});

export default router;
