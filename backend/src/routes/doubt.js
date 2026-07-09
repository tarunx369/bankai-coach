import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { answerDoubt } from '../services/openaiService.js';

const router = Router();

router.post('/ask', requireAuth, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: 'question is required' });
    const result = await answerDoubt({ question });
    res.json(result);
  } catch (err) {
    console.error('[doubt/ask]', err);
    res.status(500).json({ message: 'Failed to answer doubt' });
  }
});

export default router;
