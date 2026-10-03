import { Router } from 'express';
import { z } from 'zod';
import { criteria, recalculateAll, updateCriteria } from '../controllers/scoring.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const criteriaSchema = z.object({
  criteria: z.array(z.object({
    criterionKey: z.string().min(1),
    weight: z.coerce.number().min(0).max(100),
    maxScore: z.coerce.number().min(0).max(100).optional(),
    isActive: z.boolean().optional()
  })).min(1)
});

const router = Router();

router.use(requireAuth);
router.get('/criteria', criteria);
router.put('/criteria', validate(criteriaSchema), updateCriteria);
router.post('/recalculate-all', recalculateAll);

export default router;

