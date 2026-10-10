INSERT INTO scoring_criteria (criterion_key, criterion_name, weight, max_score, is_active)
VALUES
  ('technical_skills', 'Technical skills', 35, 35, TRUE),
  ('project_experience', 'Project experience', 25, 25, TRUE),
  ('motivation', 'Motivation', 20, 20, TRUE),
  ('availability', 'Availability', 10, 10, TRUE),
  ('application_quality', 'Application quality', 10, 10, TRUE)
ON CONFLICT (criterion_key) DO NOTHING;

INSERT INTO application_reference_sequences (year, last_number)
VALUES (2026, 2)
ON CONFLICT (year) DO UPDATE
SET last_number = GREATEST(application_reference_sequences.last_number, 2);

INSERT INTO candidates (
  application_reference, first_name, last_name, email, phone, country, city, domain,
  experience_level, education_level, current_status, years_experience, motivation,
  learning_goal, preferred_domain, weekly_availability, program_available, status,
  automatic_score, human_score, final_score, qualification
)
VALUES
  ('SK-2026-0001', 'Jean', 'Kasereka', 'jean@example.com', '+243970000001', 'RDC', 'Goma',
   'Full Stack Development', 'Junior', 'Licence', 'Étudiant', 1,
   'Je souhaite renforcer mes bases backend et apprendre à construire des API propres pour résoudre des problèmes locaux.',
   'Comprendre Express, MySQL, la sécurité API et les bonnes pratiques de déploiement.',
   'Backend', 15, TRUE, 'to_review', 82, NULL, NULL, 'good_profile'),
  ('SK-2026-0002', 'Amina', 'Kabasele', 'amina@example.com', '+243970000002', 'RDC', 'Lubumbashi',
   'Frontend Development', 'Intermediate', 'Licence', 'Freelance', 2,
   'Je veux progresser dans la conception d’interfaces solides et mieux connecter mes applications aux API.',
   'Maîtriser les applications frontend professionnelles et améliorer mes bases produit.',
   'Frontend', 10, TRUE, 'new', 74, NULL, NULL, 'good_profile');

INSERT INTO candidate_skills (candidate_id, skill_name, proficiency_level)
VALUES
  (1, 'React', 'intermediate'),
  (1, 'Express.js', 'intermediate'),
  (1, 'MySQL', 'beginner'),
  (2, 'React', 'advanced'),
  (2, 'CSS', 'advanced'),
  (2, 'JavaScript', 'intermediate');

INSERT INTO projects (
  candidate_id, name, description, problem_solved, candidate_role, personal_contribution,
  technologies, github_url, demo_url, used_ai, ai_usage_description, personal_contribution_with_ai
)
VALUES
  (1, 'Salama AI', 'Application de suivi et d’orientation pour améliorer la sécurité communautaire.',
   'Le projet aide à organiser les signalements et à fournir des informations utiles rapidement.',
   'Développeur full stack junior', 'Conception des routes API, modèles de données et formulaires principaux.',
   'React, Express, MySQL', 'https://github.com/example/salama-ai', 'https://example.com/salama-ai',
   TRUE, 'Aide ponctuelle pour reformuler la documentation et comprendre certaines erreurs.',
   'Le candidat a écrit le code principal et validé les choix techniques.'),
  (2, 'Portfolio Hiring Hub', 'Portfolio interactif présentant des projets frontend et un formulaire de contact.',
   'Centralise les preuves de compétence et facilite le premier contact.',
   'Développeuse frontend', 'Design UI, intégration responsive et optimisation de l’accessibilité.',
   'React, CSS, Vite', 'https://github.com/example/portfolio-hub', 'https://example.com/portfolio-hub',
   FALSE, NULL, NULL);

INSERT INTO candidate_score_details (candidate_id, criterion_key, raw_score, weighted_score, max_score, explanation)
VALUES
  (1, 'technical_skills', 76, 26.60, 35, 'Trois compétences renseignées avec niveaux exploitables.'),
  (1, 'project_experience', 88, 22.00, 25, 'Projet documenté avec rôle, contribution, technologies et liens.'),
  (1, 'motivation', 82, 16.40, 20, 'Motivation et objectif d’apprentissage suffisamment détaillés.'),
  (1, 'availability', 75, 7.50, 10, '15 heures par semaine et disponibilité programme confirmée.'),
  (1, 'application_quality', 95, 9.50, 10, 'Candidature complète et liens valides.'),
  (2, 'technical_skills', 90, 31.50, 35, 'Trois compétences fortes renseignées.'),
  (2, 'project_experience', 72, 18.00, 25, 'Projet présent avec description et contribution.'),
  (2, 'motivation', 65, 13.00, 20, 'Motivation correcte mais perfectible.'),
  (2, 'availability', 65, 6.50, 10, '10 heures par semaine et disponibilité confirmée.'),
  (2, 'application_quality', 50, 5.00, 10, 'Candidature exploitable.');

INSERT INTO candidate_history (candidate_id, admin_id, action_type, old_value, new_value, description)
VALUES
  (1, NULL, 'APPLICATION_RECEIVED', NULL, 'SK-2026-0001', 'Candidature de démonstration reçue.'),
  (1, NULL, 'AUTO_SCORE_CALCULATED', NULL, '82', 'Score automatique initial calculé.'),
  (2, NULL, 'APPLICATION_RECEIVED', NULL, 'SK-2026-0002', 'Candidature de démonstration reçue.'),
  (2, NULL, 'AUTO_SCORE_CALCULATED', NULL, '74', 'Score automatique initial calculé.');

