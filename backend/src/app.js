import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { apiRateLimit } from './middleware/rateLimit.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import candidateRoutes from './routes/candidate.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import rankingRoutes from './routes/ranking.routes.js';
import scoringRoutes from './routes/scoring.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());
app.use(apiRateLimit);

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy.', data: { status: 'ok' } });
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

app.use(notFound);
app.use(errorHandler);

export default app;

