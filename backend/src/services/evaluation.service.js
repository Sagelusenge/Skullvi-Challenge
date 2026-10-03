import { transaction } from '../config/database.js';
import * as candidateRepository from '../repositories/candidate.repository.js';
import * as evaluationRepository from '../repositories/evaluation.repository.js';
import { AppError } from '../utils/apiResponse.js';
import {
  calculateFinalScore,
  calculateHumanOverallScore,
  calculateQualification
} from '../utils/scoringEngine.js';

export async function getEvaluations(candidateId = null) {
  return evaluationRepository.listEvaluations(candidateId);
}

export async function submitEvaluation(candidateId, adminId, evaluation) {
  return transaction(async (connection) => {
    const candidate = await candidateRepository.findCandidateById(candidateId, connection);
    if (!candidate) throw new AppError('Candidate not found', 404);

    const overallScore = calculateHumanOverallScore(evaluation);
    const evaluationId = await evaluationRepository.createEvaluation(
      candidateId,
      adminId,
      evaluation,
      overallScore,
      connection
    );
    const humanScore = await evaluationRepository.getAverageHumanScore(candidateId, connection);
    const finalScore = calculateFinalScore(candidate.automaticScore, humanScore);
    const qualification = calculateQualification(finalScore ?? candidate.automaticScore);

    await candidateRepository.updateCandidateScores(candidateId, {
      automaticScore: null,
      humanScore,
      finalScore,
      qualification
    }, connection);
    await candidateRepository.addCandidateHistory(
      candidateId,
      adminId,
      'EVALUATION_ADDED',
      null,
      String(overallScore),
      'Évaluation humaine ajoutée.',
      connection
    );
    await candidateRepository.addCandidateHistory(
      candidateId,
      adminId,
      'SCORE_UPDATED',
      null,
      String(finalScore),
      'Score humain et score final recalculés.',
      connection
    );

    return { evaluationId, overallScore, humanScore, finalScore, qualification };
  });
}

