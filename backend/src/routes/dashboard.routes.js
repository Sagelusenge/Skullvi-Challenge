import { Router } from 'express';
import { recentCandidates, stats } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/stats', stats);
router.get('/recent-candidates', recentCandidates);

export default router;

