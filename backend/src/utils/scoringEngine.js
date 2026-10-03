export const VALID_CANDIDATE_STATUSES = [
  'new',
  'to_review',
  'in_evaluation',
  'shortlisted',
  'interview',
  'selected',
  'rejected'
];

export const DEFAULT_CRITERIA = [
  { criterion_key: 'technical_skills', criterion_name: 'Technical skills', weight: 35, max_score: 35 },
  { criterion_key: 'project_experience', criterion_name: 'Project experience', weight: 25, max_score: 25 },
  { criterion_key: 'motivation', criterion_name: 'Motivation', weight: 20, max_score: 20 },
  { criterion_key: 'availability', criterion_name: 'Availability', weight: 10, max_score: 10 },
  { criterion_key: 'application_quality', criterion_name: 'Application quality', weight: 10, max_score: 10 }
];

const PROFICIENCY_SCORE = {
  beginner: 40,
  intermediate: 70,
  advanced: 100
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function textLength(value) {
  return String(value || '').trim().length;
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function analyzeTextQuality(value) {
  const normalized = normalizeText(value);
  const compact = normalized.replace(/\s+/g, '');
  const words = normalized.match(/[a-z]{3,}/g) || [];
  const uniqueWords = new Set(words);
  const vowels = compact.match(/[aeiouy]/g)?.length || 0;
  const vowelRatio = compact.length ? vowels / compact.length : 0;
  const hasSpaces = /\s/.test(normalized) && words.length >= 8;
  const diversityRatio = words.length ? uniqueWords.size / words.length : 0;
  const hasLongRepeatedRun = /(.)\1{4,}/.test(compact);
  const hasContextWords = [
    'apprendre',
    'developper',
    'developpeur',
    'projet',
    'programme',
    'competence',
    'technique',
    'solution',
    'construire',
    'backend',
    'frontend',
    'application',
    'experience',
    'objectif'
  ].some((word) => normalized.includes(word));

  const baseScore = [
    Math.min(words.length / 25, 1) * 35,
    Math.min(diversityRatio / 0.72, 1) * 25,
    vowelRatio >= 0.28 && vowelRatio <= 0.58 ? 20 : 0,
    hasSpaces ? 10 : 0,
    hasContextWords ? 10 : 0,
    hasLongRepeatedRun ? -30 : 0
  ].reduce((sum, item) => sum + item, 0);
  const cappedScore = !hasSpaces && compact.length > 60
    ? Math.min(baseScore, 15)
    : words.length < 5
      ? Math.min(baseScore, 25)
      : baseScore;

  return {
    words: words.length,
    uniqueWords: uniqueWords.size,
    diversityRatio,
    vowelRatio,
    hasContextWords,
    hasLongRepeatedRun,
    qualityScore: clamp(cappedScore)
  };
}

function hasText(value, minLength = 1) {
  return textLength(value) >= minLength;
}

function isValidUrl(value) {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function weighted(rawScore, criterion) {
  const maxScore = Number(criterion.max_score ?? criterion.weight);
  const weightedScore = Math.round((clamp(rawScore) / 100) * maxScore * 100) / 100;
  return { rawScore: Math.round(clamp(rawScore)), weightedScore, maxScore };
}

function scoreTechnicalSkills(application, criterion) {
  const skills = application.skills || [];
  const countScore = Math.min(skills.length * 12, 48);
  const levels = skills.map((skill) => PROFICIENCY_SCORE[skill.level || skill.proficiency_level]).filter(Boolean);
  const levelScore = levels.length
    ? levels.reduce((sum, score) => sum + score, 0) / levels.length * 0.52
    : 0;
  const rawScore = countScore + levelScore;

  return {
    criterion: 'technical_skills',
    ...weighted(rawScore, criterion),
    explanation: `Le candidat a renseigné ${skills.length} compétence(s), avec ${levels.length} niveau(x) exploitable(s).`
  };
}

function scoreProjectExperience(application, criterion) {
  const project = application.project || {};
  const checks = [
    hasText(project.name),
    hasText(project.description, 30),
    hasText(project.problemSolved || project.problem_solved, 20),
    hasText(project.candidateRole || project.candidate_role, 10),
    hasText(project.personalContribution || project.personal_contribution, 20),
    hasText(project.technologies, 3),
    Boolean(project.githubUrl || project.github_url || project.gitlabUrl || project.gitlab_url || project.demoUrl || project.demo_url || project.portfolioUrl || project.portfolio_url)
  ];
  const rawScore = checks.filter(Boolean).length / checks.length * 100;

  return {
    criterion: 'project_experience',
    ...weighted(rawScore, criterion),
    explanation: `Le projet contient ${checks.filter(Boolean).length}/${checks.length} éléments utiles à l'évaluation.`
  };
}

function scoreMotivation(application, criterion) {
  const motivationText = application.motivation;
  const learningGoalText = application.learningGoal || application.learning_goal;
  const preferredDomain = textLength(application.preferredDomain || application.preferred_domain);
  const motivationQuality = analyzeTextQuality(motivationText);
  const learningGoalQuality = analyzeTextQuality(learningGoalText);
  const motivationCompleteness = Math.min(textLength(motivationText) / 150, 1) * motivationQuality.qualityScore;
  const learningGoalCompleteness = Math.min(textLength(learningGoalText) / 120, 1) * learningGoalQuality.qualityScore;
  const rawScore = [
    motivationCompleteness * 0.45,
    learningGoalCompleteness * 0.40,
    preferredDomain > 0 ? 15 : 0
  ].reduce((sum, score) => sum + score, 0);

  return {
    criterion: 'motivation',
    ...weighted(rawScore, criterion),
    explanation: `Le score vérifie la longueur, le nombre de mots, la diversité lexicale, les répétitions et les mots de contexte. Motivation: ${motivationQuality.words} mot(s), qualité ${Math.round(motivationQuality.qualityScore)}/100; objectif: ${learningGoalQuality.words} mot(s), qualité ${Math.round(learningGoalQuality.qualityScore)}/100.`
  };
}

function scoreAvailability(application, criterion) {
  const hours = Number(application.weeklyAvailability ?? application.weekly_availability ?? 0);
  const programAvailable = Boolean(application.programAvailable ?? application.program_available);
  const hoursScore = Math.min(hours / 20, 1) * 70;
  const rawScore = hoursScore + (programAvailable ? 30 : 0);

  return {
    criterion: 'availability',
    ...weighted(rawScore, criterion),
    explanation: `Disponibilité déclarée: ${hours} heure(s)/semaine; disponibilité programme: ${programAvailable ? 'oui' : 'non'}.`
  };
}

function scoreApplicationQuality(application, criterion) {
  const requiredChecks = [
    hasText(application.firstName || application.first_name),
    hasText(application.lastName || application.last_name),
    hasText(application.email),
    hasText(application.phone),
    hasText(application.country),
    hasText(application.city),
    hasText(application.domain),
    hasText(application.experienceLevel || application.experience_level),
    hasText(application.educationLevel || application.education_level),
    hasText(application.currentStatus || application.current_status)
  ];
  const project = application.project || {};
  const links = [
    project.githubUrl || project.github_url,
    project.gitlabUrl || project.gitlab_url,
    project.portfolioUrl || project.portfolio_url,
    project.demoUrl || project.demo_url
  ].filter(Boolean);
  const linksValid = links.every(isValidUrl);
  const completeness = requiredChecks.filter(Boolean).length / requiredChecks.length * 85;
  const rawScore = completeness + (linksValid ? 15 : 0);

  return {
    criterion: 'application_quality',
    ...weighted(rawScore, criterion),
    explanation: `Champs importants complétés: ${requiredChecks.filter(Boolean).length}/${requiredChecks.length}; liens fournis valides: ${linksValid ? 'oui' : 'non'}.`
  };
}

export function calculateAutomaticScore(application, criteria = DEFAULT_CRITERIA) {
  const criteriaByKey = new Map(criteria.map((criterion) => [criterion.criterion_key, criterion]));
  const scorers = [
    ['technical_skills', scoreTechnicalSkills],
    ['project_experience', scoreProjectExperience],
    ['motivation', scoreMotivation],
    ['availability', scoreAvailability],
    ['application_quality', scoreApplicationQuality]
  ];
  const defaultByKey = new Map(DEFAULT_CRITERIA.map((criterion) => [criterion.criterion_key, criterion]));

  const details = scorers.map(([key, scorer]) => (
    scorer(application, criteriaByKey.get(key) || defaultByKey.get(key))
  ));
  const total = Math.round(details.reduce((sum, detail) => sum + detail.weightedScore, 0));

  return {
    details,
    total: Math.max(0, Math.min(100, total))
  };
}

export function calculateQualification(score) {
  const numericScore = Number(score) || 0;
  if (numericScore >= 85) return 'priority';
  if (numericScore >= 70) return 'good_profile';
  if (numericScore >= 55) return 'to_review';
  if (numericScore >= 40) return 'low_match';
  return 'low_priority';
}

export function calculateHumanOverallScore(evaluation) {
  const values = [
    evaluation.technicalSkills ?? evaluation.technical_skills,
    evaluation.problemSolving ?? evaluation.problem_solving,
    evaluation.projectQuality ?? evaluation.project_quality,
    evaluation.motivation,
    evaluation.learningPotential ?? evaluation.learning_potential
  ].map(Number);

  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10);
}

export function calculateFinalScore(automaticScore, humanScore) {
  if (humanScore === null || humanScore === undefined) return null;
  return Math.round((Number(automaticScore || 0) * 0.6 + Number(humanScore) * 0.4) * 100) / 100;
}

