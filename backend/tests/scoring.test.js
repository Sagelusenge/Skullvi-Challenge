import {
  DEFAULT_CRITERIA,
  calculateAutomaticScore,
  calculateFinalScore,
  calculateHumanOverallScore
} from '../src/utils/scoringEngine.js';

const completeApplication = {
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
  skills: [
    { name: 'React', level: 'intermediate' },
    { name: 'Express.js', level: 'intermediate' },
    { name: 'MySQL', level: 'beginner' }
  ],
  project: {
    name: 'Salama AI',
    description: 'Application complète pour organiser des signalements et consulter des informations utiles.',
    problemSolved: 'Centraliser les informations et aider à prioriser les actions.',
    candidateRole: 'Développeur full stack',
    personalContribution: 'Création des routes API, formulaires et structure MySQL.',
    technologies: 'React, Express, MySQL',
    githubUrl: 'https://github.com/example/salama-ai',
    demoUrl: 'https://example.com/salama-ai'
  },
  motivation: 'Je veux apprendre à construire des API solides et compréhensibles pour résoudre des problèmes concrets.',
  learningGoal: 'Mieux comprendre Express, MySQL, la sécurité API et les tests.',
  preferredDomain: 'Backend',
  weeklyAvailability: 15,
  programAvailable: true
};

test('automatic score stays between 0 and 100 and returns criterion details', () => {
  const result = calculateAutomaticScore(completeApplication, DEFAULT_CRITERIA);
  expect(result.total).toBeGreaterThanOrEqual(0);
  expect(result.total).toBeLessThanOrEqual(100);
  expect(result.details).toHaveLength(5);
  expect(result.details[0]).toHaveProperty('explanation');
});

test('same input always returns the same automatic score', () => {
  expect(calculateAutomaticScore(completeApplication, DEFAULT_CRITERIA))
    .toEqual(calculateAutomaticScore(completeApplication, DEFAULT_CRITERIA));
});

test('complete application scores higher than a sparse application', () => {
  const sparse = {
    ...completeApplication,
    skills: [{ name: 'HTML', level: 'beginner' }],
    project: undefined,
    motivation: 'Motivé.',
    learningGoal: 'Apprendre.',
    weeklyAvailability: 2,
    programAvailable: false
  };

  expect(calculateAutomaticScore(completeApplication).total)
    .toBeGreaterThan(calculateAutomaticScore(sparse).total);
});

test('random-looking motivation text is penalized even when long', () => {
  const randomText = 'xwaudfuieuadotwHASOUAO24'.repeat(10);
  const randomApplication = {
    ...completeApplication,
    motivation: randomText,
    learningGoal: randomText
  };

  const normalMotivation = calculateAutomaticScore(completeApplication)
    .details.find((detail) => detail.criterion === 'motivation');
  const randomMotivation = calculateAutomaticScore(randomApplication)
    .details.find((detail) => detail.criterion === 'motivation');

  expect(randomMotivation.weightedScore).toBeLessThan(normalMotivation.weightedScore);
});

test('default scoring weights total 100', () => {
  expect(DEFAULT_CRITERIA.reduce((sum, criterion) => sum + criterion.weight, 0)).toBe(100);
});

test('human and final scores are calculated by backend formulas', () => {
  const human = calculateHumanOverallScore({
    technicalSkills: 8,
    problemSolving: 9,
    projectQuality: 8,
    motivation: 9,
    learningPotential: 9
  });
  expect(human).toBe(86);
  expect(calculateFinalScore(80, human)).toBe(82.4);
  expect(calculateFinalScore(80, null)).toBeNull();
});

