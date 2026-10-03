import { jest } from '@jest/globals';
import { evaluationSchema } from '../src/validators/evaluation.validator.js';

const transaction = jest.fn(async (callback) => callback('connection'));
const findCandidateById = jest.fn();
const updateCandidateScores = jest.fn();
const addCandidateHistory = jest.fn();
const createEvaluation = jest.fn();
const getAverageHumanScore = jest.fn();

jest.unstable_mockModule('../src/config/database.js', () => ({ transaction }));
jest.unstable_mockModule('../src/repositories/candidate.repository.js', () => ({
  findCandidateById,
  updateCandidateScores,
  addCandidateHistory
}));
jest.unstable_mockModule('../src/repositories/evaluation.repository.js', () => ({
  createEvaluation,
  getAverageHumanScore,
  listEvaluations: jest.fn()
}));

const { submitEvaluation } = await import('../src/services/evaluation.service.js');

const validEvaluation = {
  technicalSkills: 8,
  problemSolving: 9,
  projectQuality: 8,
  motivation: 9,
  learningPotential: 9,
  comment: 'Très bon potentiel.'
};

beforeEach(() => {
  jest.clearAllMocks();
  findCandidateById.mockResolvedValue({ id: 1, automaticScore: 80 });
  createEvaluation.mockResolvedValue(5);
  getAverageHumanScore.mockResolvedValue(86);
});

test('score greater than 10 is rejected', () => {
  expect(evaluationSchema.safeParse({ ...validEvaluation, technicalSkills: 11 }).success).toBe(false);
});

test('score lower than 0 is rejected', () => {
  expect(evaluationSchema.safeParse({ ...validEvaluation, motivation: -1 }).success).toBe(false);
});

test('valid evaluation is accepted', () => {
  expect(evaluationSchema.safeParse(validEvaluation).success).toBe(true);
});

test('evaluation service recalculates overall, human and final scores', async () => {
  const result = await submitEvaluation(1, 2, validEvaluation);

  expect(result.overallScore).toBe(86);
  expect(result.humanScore).toBe(86);
  expect(result.finalScore).toBe(82.4);
  expect(createEvaluation).toHaveBeenCalledWith(1, 2, validEvaluation, 86, 'connection');
  expect(updateCandidateScores).toHaveBeenCalledWith(
    1,
    expect.objectContaining({ humanScore: 86, finalScore: 82.4 }),
    'connection'
  );
  expect(addCandidateHistory).toHaveBeenCalledTimes(2);
});

