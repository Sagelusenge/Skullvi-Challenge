import { execute } from '../config/database.js';

export async function listEvaluations(candidateId = null) {
  const params = [];
  const where = candidateId ? 'WHERE e.candidate_id = $1' : '';
  if (candidateId) params.push(candidateId);

  return execute(
    `SELECT e.id, e.candidate_id AS "candidateId", e.admin_id AS "adminId",
      e.technical_skills AS "technicalSkills", e.problem_solving AS "problemSolving",
      e.project_quality AS "projectQuality", e.motivation, e.learning_potential AS "learningPotential",
      e.overall_score AS "overallScore", e.comment, e.created_at AS "createdAt", e.updated_at AS "updatedAt",
      CONCAT(a.first_name, ' ', a.last_name) AS "adminName"
     FROM evaluations e
     JOIN admins a ON a.id = e.admin_id
     ${where}
     ORDER BY e.created_at DESC`,
    params
  );
}

export async function createEvaluation(candidateId, adminId, evaluation, overallScore, connection) {
  const result = await execute(
    `INSERT INTO evaluations (
      candidate_id, admin_id, technical_skills, problem_solving, project_quality,
      motivation, learning_potential, overall_score, comment
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    [
      candidateId,
      adminId,
      evaluation.technicalSkills,
      evaluation.problemSolving,
      evaluation.projectQuality,
      evaluation.motivation,
      evaluation.learningPotential,
      overallScore,
      evaluation.comment || null
    ],
    connection
  );

  return result[0].id;
}

export async function getAverageHumanScore(candidateId, connection = null) {
  const rows = await execute(
    `SELECT AVG(overall_score) AS "humanScore"
     FROM evaluations
     WHERE candidate_id = $1`,
    [candidateId],
    connection
  );

  return rows[0].humanScore === null ? null : Math.round(Number(rows[0].humanScore) * 100) / 100;
}

