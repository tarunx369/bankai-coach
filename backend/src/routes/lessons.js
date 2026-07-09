import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { generateLesson } from '../services/openaiService.js';

const router = Router();

router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { title, topics, track } = req.body;
    if (!title || !topics) return res.status(400).json({ message: 'title and topics are required' });
    const result = await generateLesson({ title, topics, track });
    res.json(result);
  } catch (err) {
    console.error('[lessons/generate]', err);
    res.status(500).json({ message: 'Failed to generate lesson' });
  }
});

export default router;
