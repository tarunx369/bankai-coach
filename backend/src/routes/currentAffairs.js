import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { generateCurrentAffairs } from '../services/openaiService.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const result = await generateCurrentAffairs({ date });
    res.json(result);
  } catch (err) {
    console.error('[current-affairs]', err);
    res.status(500).json({ message: 'Failed to generate current affairs' });
  }
});

export default router;
