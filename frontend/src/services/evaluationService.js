import { api } from './api.js';

export function getEvaluations() {
  return api.get('/evaluations');
}

export function submitEvaluation(evaluation) {
  return api.post('/evaluations', evaluation);
}

