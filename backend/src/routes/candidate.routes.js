import { Router } from 'express';
import {
  addEvaluation,
  index,
  recalculateScore,
  show,
  store,
  updateStatus
} from '../controllers/candidate.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createCandidateSchema,
  listCandidatesQuerySchema,
  updateStatusSchema
} from '../validators/candidate.validator.js';
import { evaluationSchema } from '../validators/evaluation.validator.js';

const router = Router();

router.post('/', validate(createCandidateSchema), store);

router.use(requireAuth);

router.get('/', validate(listCandidatesQuerySchema, 'query'), index);
router.get('/:id', show);
router.patch('/:id/status', validate(updateStatusSchema), updateStatus);
router.post('/:id/evaluations', validate(evaluationSchema), addEvaluation);
router.post('/:id/recalculate-score', recalculateScore);

export default router;

