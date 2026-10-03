import { Router } from 'express';
import { index } from '../controllers/evaluation.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', index);

export default router;

