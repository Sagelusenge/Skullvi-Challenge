import { api } from './api.js';

export function getScoringCriteria() {
  return api.get('/scoring/criteria');
}

export function updateScoringCriteria(criteria) {
  return api.put('/scoring/criteria', criteria);
}

