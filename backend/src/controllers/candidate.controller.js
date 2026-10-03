import * as candidateService from '../services/candidate.service.js';
import * as evaluationService from '../services/evaluation.service.js';
import { created, success } from '../utils/apiResponse.js';

export async function store(req, res, next) {
  try {
    const result = await candidateService.submitCandidate(req.body);
    return created(res, 'Candidature enregistrée avec succès.', result);
  } catch (err) {
    return next(err);
  }
}

export async function index(req, res, next) {
  try {
    const result = await candidateService.getCandidates(req.query);
    return success(res, 'Candidatures récupérées.', result.candidates, 200, result.pagination);
  } catch (err) {
    return next(err);
  }
}

export async function show(req, res, next) {
  try {
    const candidate = await candidateService.getCandidate(req.params.id);
    return success(res, 'Candidature récupérée.', candidate);
  } catch (err) {
    return next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const result = await candidateService.updateStatus(req.params.id, req.body.status, req.user.id);
    return success(res, 'Statut mis à jour.', result);
  } catch (err) {
    return next(err);
  }
}

export async function addEvaluation(req, res, next) {
  try {
    const result = await evaluationService.submitEvaluation(req.params.id, req.user.id, req.body);
    return created(res, 'Évaluation enregistrée.', result);
  } catch (err) {
    return next(err);
  }
}

export async function recalculateScore(req, res, next) {
  try {
    const result = await candidateService.recalculateAutomaticScore(req.params.id, req.user.id);
    return success(res, 'Score recalculé.', result);
  } catch (err) {
    return next(err);
  }
}

