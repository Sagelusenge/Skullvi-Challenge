INSERT INTO scoring_criteria (criterion_key, criterion_name, weight, max_score, is_active)
VALUES
  ('technical_skills', 'Technical skills', 35, 35, TRUE),
  ('project_experience', 'Project experience', 25, 25, TRUE),
  ('motivation', 'Motivation', 20, 20, TRUE),
  ('availability', 'Availability', 10, 10, TRUE),
  ('application_quality', 'Application quality', 10, 10, TRUE)
ON CONFLICT (criterion_key) DO NOTHING;
