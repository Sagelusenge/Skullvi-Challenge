import { Router } from 'express';
import { z } from 'zod';
import { index } from '../controllers/ranking.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { VALID_CANDIDATE_STATUSES } from '../utils/scoringEngine.js';

const rankingQuerySchema = z.object({
  domain: z.string().trim().optional(),
  status: z.enum(VALID_CANDIDATE_STATUSES).optional(),
  minScore: z.coerce.number().min(0).max(100).optional(),
  maxScore: z.coerce.number().min(0).max(100).optional()
});

const router = Router();

router.use(requireAuth);
router.get('/', validate(rankingQuerySchema, 'query'), index);

export default router;

