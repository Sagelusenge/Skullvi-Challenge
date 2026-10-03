import { execute } from '../config/database.js';
import { formatApplicationReference } from '../utils/generateReference.js';

const SORT_COLUMNS = {
  submitted_at: 'c.submitted_at',
  automatic_score: 'c.automatic_score',
  human_score: 'c.human_score',
  final_score: 'c.final_score',
  last_name: 'c.last_name',
  domain: 'c.domain',
  status: 'c.status'
};

function candidateSelect() {
  return `c.id, c.application_reference AS applicationReference,
    c.first_name AS firstName, c.last_name AS lastName, c.email, c.phone,
    c.country, c.city, c.domain, c.experience_level AS experienceLevel,
    c.education_level AS educationLevel, c.current_status AS currentStatus,
    c.years_experience AS yearsExperience, c.motivation, c.learning_goal AS learningGoal,
    c.preferred_domain AS preferredDomain, c.weekly_availability AS weeklyAvailability,
    c.program_available AS programAvailable, c.status, c.automatic_score AS automaticScore,
    c.human_score AS humanScore, c.final_score AS finalScore, c.qualification,
    c.submitted_at AS submittedAt, c.updated_at AS updatedAt`;
}

function buildCandidateFilters(filters = {}) {
  const where = [];
  const params = [];

  if (filters.search) {
    where.push('(c.first_name LIKE ? OR c.last_name LIKE ? OR c.email LIKE ? OR c.application_reference LIKE ?)');
    const value = `%${filters.search}%`;
    params.push(value, value, value, value);
  }
  if (filters.domain) {
    where.push('c.domain = ?');
    params.push(filters.domain);
  }
  if (filters.status) {
    where.push('c.status = ?');
    params.push(filters.status);
  }
  if (filters.minScore !== undefined) {
    where.push('COALESCE(c.final_score, c.automatic_score, 0) >= ?');
    params.push(filters.minScore);
  }
  if (filters.maxScore !== undefined) {
    where.push('COALESCE(c.final_score, c.automatic_score, 0) <= ?');
    params.push(filters.maxScore);
  }

  return {
    clause: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params
  };
}

export async function generateApplicationReference(connection) {
  const year = new Date().getFullYear();
  await execute(
    `INSERT INTO application_reference_sequences (year, last_number)
     VALUES (?, 0)
     ON DUPLICATE KEY UPDATE year = year`,
    [year],
    connection
  );
  await execute(
    `UPDATE application_reference_sequences
     SET last_number = LAST_INSERT_ID(last_number + 1)
     WHERE year = ?`,
    [year],
    connection
  );
  const rows = await execute('SELECT LAST_INSERT_ID() AS nextNumber', [], connection);
  return formatApplicationReference(rows[0].nextNumber);
}

export async function listCandidates(filters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;
  const { clause, params } = buildCandidateFilters(filters);
  const sortColumn = SORT_COLUMNS[filters.sortBy] || SORT_COLUMNS.submitted_at;
  const order = filters.order === 'asc' ? 'ASC' : 'DESC';

  const rows = await execute(
    `SELECT ${candidateSelect()}
     FROM candidates c
     ${clause}
     ORDER BY ${sortColumn} ${order}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const countRows = await execute(
    `SELECT COUNT(*) AS total
     FROM candidates c
     ${clause}`,
    params
  );

  return { rows, total: countRows[0].total };
}

export async function findCandidateById(id, connection = null) {
  const rows = await execute(
    `SELECT ${candidateSelect()}
     FROM candidates c
     WHERE c.id = ?
     LIMIT 1`,
    [id],
    connection
  );

  return rows[0] || null;
}

export async function createCandidate(data, connection) {
  const result = await execute(
    `INSERT INTO candidates (
      application_reference, first_name, last_name, email, phone, country, city, domain,
      experience_level, education_level, current_status, years_experience, motivation,
      learning_goal, preferred_domain, weekly_availability, program_available, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
    [
      data.applicationReference,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.country,
      data.city,
      data.domain,
      data.experienceLevel,
      data.educationLevel,
      data.currentStatus,
      data.yearsExperience,
      data.motivation,
      data.learningGoal,
      data.preferredDomain,
      data.weeklyAvailability,
      data.programAvailable
    ],
    connection
  );

  return result.insertId;
}

export async function addCandidateSkills(candidateId, skills, connection) {
  if (!skills.length) return;
  await Promise.all(skills.map((skill) => execute(
    `INSERT INTO candidate_skills (candidate_id, skill_name, proficiency_level)
     VALUES (?, ?, ?)`,
    [candidateId, skill.name, skill.level],
    connection
  )));
}

export async function addCandidateProject(candidateId, project, connection) {
  if (!project) return null;
  const result = await execute(
    `INSERT INTO projects (
      candidate_id, name, description, problem_solved, candidate_role, personal_contribution,
      technologies, github_url, gitlab_url, portfolio_url, demo_url, used_ai,
      ai_usage_description, personal_contribution_with_ai
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      candidateId,
      project.name,
      project.description,
      project.problemSolved,
      project.candidateRole,
      project.personalContribution,
      project.technologies,
      project.githubUrl || null,
      project.gitlabUrl || null,
      project.portfolioUrl || null,
      project.demoUrl || null,
      project.usedAi || false,
      project.aiUsageDescription || null,
      project.personalContributionWithAi || null
    ],
    connection
  );

  return result.insertId;
}

export async function getCandidateSkills(candidateId) {
  return execute(
    `SELECT id, skill_name AS name, proficiency_level AS level, created_at AS createdAt
     FROM candidate_skills
     WHERE candidate_id = ?
     ORDER BY id ASC`,
    [candidateId]
  );
}

export async function getCandidateProject(candidateId) {
  const rows = await execute(
    `SELECT id, name, description, problem_solved AS problemSolved, candidate_role AS candidateRole,
      personal_contribution AS personalContribution, technologies, github_url AS githubUrl,
      gitlab_url AS gitlabUrl, portfolio_url AS portfolioUrl, demo_url AS demoUrl,
      used_ai AS usedAi, ai_usage_description AS aiUsageDescription,
      personal_contribution_with_ai AS personalContributionWithAi, created_at AS createdAt,
      updated_at AS updatedAt
     FROM projects
     WHERE candidate_id = ?
     LIMIT 1`,
    [candidateId]
  );

  return rows[0] || null;
}

export async function replaceCandidateScoreDetails(candidateId, details, connection) {
  await execute('DELETE FROM candidate_score_details WHERE candidate_id = ?', [candidateId], connection);
  await Promise.all(details.map((detail) => execute(
    `INSERT INTO candidate_score_details
      (candidate_id, criterion_key, raw_score, weighted_score, max_score, explanation)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [candidateId, detail.criterion, detail.rawScore, detail.weightedScore, detail.maxScore, detail.explanation],
    connection
  )));
}

export async function getCandidateScoreDetails(candidateId) {
  return execute(
    `SELECT id, criterion_key AS criterion, raw_score AS rawScore, weighted_score AS weightedScore,
      max_score AS maxScore, explanation, created_at AS createdAt
     FROM candidate_score_details
     WHERE candidate_id = ?
     ORDER BY id ASC`,
    [candidateId]
  );
}

export async function updateCandidateScores(candidateId, scores, connection = null) {
  await execute(
    `UPDATE candidates
     SET automatic_score = COALESCE(?, automatic_score),
         human_score = ?,
         final_score = ?,
         qualification = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      scores.automaticScore ?? null,
      scores.humanScore ?? null,
      scores.finalScore ?? null,
      scores.qualification,
      candidateId
    ],
    connection
  );
}

export async function updateCandidateStatus(candidateId, status, connection) {
  await execute(
    `UPDATE candidates
     SET status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [status, candidateId],
    connection
  );
}

export async function addCandidateHistory(candidateId, adminId, actionType, oldValue, newValue, description, connection = null) {
  await execute(
    `INSERT INTO candidate_history (candidate_id, admin_id, action_type, old_value, new_value, description)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [candidateId, adminId || null, actionType, oldValue || null, newValue || null, description || null],
    connection
  );
}

export async function getCandidateHistory(candidateId) {
  return execute(
    `SELECT h.id, h.admin_id AS adminId, h.action_type AS actionType, h.old_value AS oldValue,
      h.new_value AS newValue, h.description, h.created_at AS createdAt
     FROM candidate_history h
     WHERE h.candidate_id = ?
     ORDER BY h.created_at DESC, h.id DESC`,
    [candidateId]
  );
}

