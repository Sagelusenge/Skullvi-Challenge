import { jest } from '@jest/globals';
import { createCandidateSchema } from '../src/validators/candidate.validator.js';

const transaction = jest.fn(async (callback) => callback('connection'));
const generateApplicationReference = jest.fn();
const createCandidate = jest.fn();
const addCandidateSkills = jest.fn();
const addCandidateProject = jest.fn();
const replaceCandidateScoreDetails = jest.fn();
const updateCandidateScores = jest.fn();
const addCandidateHistory = jest.fn();
const getActiveCriteria = jest.fn();

jest.unstable_mockModule('../src/config/database.js', () => ({ transaction }));
jest.unstable_mockModule('../src/repositories/candidate.repository.js', () => ({
  generateApplicationReference,
  createCandidate,
  addCandidateSkills,
  addCandidateProject,
  replaceCandidateScoreDetails,
  updateCandidateScores,
  addCandidateHistory
}));
jest.unstable_mockModule('../src/repositories/evaluation.repository.js', () => ({
  listEvaluations: jest.fn()
}));
jest.unstable_mockModule('../src/repositories/scoring.repository.js', () => ({
  getActiveCriteria
}));

const { submitCandidate } = await import('../src/services/candidate.service.js');
const { DEFAULT_CRITERIA } = await import('../src/utils/scoringEngine.js');

const validCandidate = {
  firstName: 'Jean',
  lastName: 'Kasereka',
  email: 'jean@example.com',
  phone: '+243970000000',
  country: 'RDC',
  city: 'Goma',
  domain: 'Full Stack Development',
  experienceLevel: 'Junior',
  educationLevel: 'Licence',
  currentStatus: 'Étudiant',
  yearsExperience: 1,
  skills: [{ name: 'React', level: 'intermediate' }],
  project: {
    name: 'Salama AI',
    description: 'Application complète de suivi communautaire.',
    problemSolved: 'Organisation des signalements.',
    candidateRole: 'Développeur full stack',
    personalContribution: 'Routes API et interface.',
    technologies: 'React, Express, MySQL',
    githubUrl: 'https://github.com/example/project',
    usedAi: false
  },
  motivation: 'Je veux apprendre à construire des API propres et testables.',
  learningGoal: 'Comprendre Express, MySQL, JWT et les transactions.',
  preferredDomain: 'Backend',
  weeklyAvailability: 15,
  programAvailable: true
};

beforeEach(() => {
  jest.clearAllMocks();
  generateApplicationReference.mockResolvedValue('SK-2026-0001');
  createCandidate.mockResolvedValue(10);
  getActiveCriteria.mockResolvedValue(DEFAULT_CRITERIA);
});

test('valid candidate payload passes validation', () => {
  expect(createCandidateSchema.safeParse(validCandidate).success).toBe(true);
});

test('missing required field is rejected', () => {
  const result = createCandidateSchema.safeParse({ ...validCandidate, firstName: '' });
  expect(result.success).toBe(false);
});

test('invalid email is rejected', () => {
  const result = createCandidateSchema.safeParse({ ...validCandidate, email: 'bad-email' });
  expect(result.success).toBe(false);
});

test('invalid skill level is rejected', () => {
  const result = createCandidateSchema.safeParse({
    ...validCandidate,
    skills: [{ name: 'React', level: 'expert' }]
  });
  expect(result.success).toBe(false);
});

test('invalid link is rejected', () => {
  const result = createCandidateSchema.safeParse({
    ...validCandidate,
    project: { ...validCandidate.project, githubUrl: 'not-a-url' }
  });
  expect(result.success).toBe(false);
});

test('valid submission is saved with reference, score details and history', async () => {
  const result = await submitCandidate(validCandidate);

  expect(result.applicationReference).toBe('SK-2026-0001');
  expect(createCandidate).toHaveBeenCalledWith(
    expect.objectContaining({ applicationReference: 'SK-2026-0001' }),
    'connection'
  );
  expect(addCandidateSkills).toHaveBeenCalled();
  expect(replaceCandidateScoreDetails).toHaveBeenCalled();
  expect(updateCandidateScores).toHaveBeenCalledWith(
    10,
    expect.objectContaining({ automaticScore: expect.any(Number) }),
    'connection'
  );
  expect(addCandidateHistory).toHaveBeenCalledTimes(2);
});

