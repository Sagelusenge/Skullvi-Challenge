import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { execute } from './config/database.js';
import { apiRateLimit } from './middleware/rateLimit.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import candidateRoutes from './routes/candidate.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import rankingRoutes from './routes/ranking.routes.js';
import scoringRoutes from './routes/scoring.routes.js';

const app = express();
const frontendDist = resolve(dirname(fileURLToPath(import.meta.url)), '../../frontend/dist');

if (process.env.RENDER) app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());
app.use('/api', apiRateLimit);

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy.', data: { status: 'ok' } });
});

app.get('/api/v1/health/ready', async (req, res) => {
  try {
    await execute('SELECT 1 FROM scoring_criteria LIMIT 1');
    return res.json({ success: true, data: { status: 'ready' } });
  } catch {
    return res.status(503).json({ success: false, message: 'Database unavailable.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy.', data: { status: 'ok' } });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/evaluations', evaluationRoutes);
app.use('/api/v1/ranking', rankingRoutes);
app.use('/api/v1/scoring', scoringRoutes);

if (existsSync(resolve(frontendDist, 'index.html'))) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path === '/api' || req.path.startsWith('/api/')) return next();
    return res.sendFile(resolve(frontendDist, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;

