import { transaction } from '../config/database.js';
import * as candidateRepository from '../repositories/candidate.repository.js';
import * as evaluationRepository from '../repositories/evaluation.repository.js';
import { getActiveCriteria } from '../repositories/scoring.repository.js';
import { AppError } from '../utils/apiResponse.js';
import {
  calculateAutomaticScore,
  calculateFinalScore,
  calculateQualification,
  VALID_CANDIDATE_STATUSES
} from '../utils/scoringEngine.js';

async function buildScoringApplication(candidateId, originalInput = null) {
  if (originalInput) return originalInput;
  const candidate = await candidateRepository.findCandidateById(candidateId);
  if (!candidate) throw new AppError('Candidate not found', 404);
  return {
    ...candidate,
    skills: await candidateRepository.getCandidateSkills(candidateId),
    project: await candidateRepository.getCandidateProject(candidateId)
  };
}

export async function submitCandidate(data) {
  return transaction(async (connection) => {
    const applicationReference = await candidateRepository.generateApplicationReference(connection);
    const candidateId = await candidateRepository.createCandidate({ ...data, applicationReference }, connection);

    await candidateRepository.addCandidateSkills(candidateId, data.skills, connection);
    await candidateRepository.addCandidateProject(candidateId, data.project, connection);

    const criteria = await getActiveCriteria(connection);
    const scoring = calculateAutomaticScore(data, criteria);
    const qualification = calculateQualification(scoring.total);

    await candidateRepository.replaceCandidateScoreDetails(candidateId, scoring.details, connection);
    await candidateRepository.updateCandidateScores(candidateId, {
      automaticScore: scoring.total,
      humanScore: null,
      finalScore: null,
      qualification
    }, connection);
    await candidateRepository.addCandidateHistory(
      candidateId,
      null,
      'APPLICATION_RECEIVED',
      null,
      applicationReference,
      'Candidature reçue depuis le formulaire public.',
      connection
    );
    await candidateRepository.addCandidateHistory(
      candidateId,
      null,
      'AUTO_SCORE_CALCULATED',
      null,
      String(scoring.total),
      'Score automatique calculé lors de la soumission.',
      connection
    );

    return { applicationReference };
  });
}

export async function getCandidates(query) {
  const result = await candidateRepository.listCandidates(query);
  return {
    candidates: result.rows,
    pagination: {
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / query.limit)
    }
  };
}

export async function getCandidate(id) {
  const candidate = await candidateRepository.findCandidateById(id);
  if (!candidate) throw new AppError('Candidate not found', 404);

  const [skills, project, scoreDetails, evaluations, history] = await Promise.all([
    candidateRepository.getCandidateSkills(id),
    candidateRepository.getCandidateProject(id),
    candidateRepository.getCandidateScoreDetails(id),
    evaluationRepository.listEvaluations(id),
    candidateRepository.getCandidateHistory(id)
  ]);

  return { ...candidate, skills, project, scoreDetails, evaluations, history };
}

export async function updateStatus(candidateId, status, adminId) {
  if (!VALID_CANDIDATE_STATUSES.includes(status)) {
    throw new AppError('Invalid candidate status', 400);
  }

  return transaction(async (connection) => {
    const candidate = await candidateRepository.findCandidateById(candidateId, connection);
    if (!candidate) throw new AppError('Candidate not found', 404);

    await candidateRepository.updateCandidateStatus(candidateId, status, connection);
    await candidateRepository.addCandidateHistory(
      candidateId,
      adminId,
      'STATUS_CHANGED',
      candidate.status,
      status,
      `Statut modifié de ${candidate.status} vers ${status}.`,
      connection
    );

    return { status };
  });
}

export async function recalculateAutomaticScore(candidateId, adminId = null, originalInput = null) {
  return transaction(async (connection) => {
    const application = await buildScoringApplication(candidateId, originalInput);
    const candidate = await candidateRepository.findCandidateById(candidateId, connection);
    if (!candidate) throw new AppError('Candidate not found', 404);

    const criteria = await getActiveCriteria(connection);
    const scoring = calculateAutomaticScore(application, criteria);
    const finalScore = calculateFinalScore(scoring.total, candidate.humanScore);
    const qualification = calculateQualification(finalScore ?? scoring.total);

    await candidateRepository.replaceCandidateScoreDetails(candidateId, scoring.details, connection);
    await candidateRepository.updateCandidateScores(candidateId, {
      automaticScore: scoring.total,
      humanScore: candidate.humanScore,
      finalScore,
      qualification
    }, connection);
    await candidateRepository.addCandidateHistory(
      candidateId,
      adminId,
      'AUTO_SCORE_CALCULATED',
      String(candidate.automaticScore ?? ''),
      String(scoring.total),
      'Score automatique recalculé.',
      connection
    );

    return { automaticScore: scoring.total, finalScore, qualification };
  });
}

