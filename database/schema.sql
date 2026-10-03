CREATE DATABASE IF NOT EXISTS skullvi_talent_engine
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE skullvi_talent_engine;

CREATE TABLE application_reference_sequences (
  year INT PRIMARY KEY,
  last_number INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE admins (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'reviewer') NOT NULL DEFAULT 'reviewer',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE candidates (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_reference VARCHAR(20) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(60) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  domain VARCHAR(120) NOT NULL,
  experience_level VARCHAR(80) NOT NULL,
  education_level VARCHAR(120) NOT NULL,
  current_status VARCHAR(120) NOT NULL,
  years_experience DECIMAL(4,1) NOT NULL DEFAULT 0,
  motivation TEXT NOT NULL,
  learning_goal TEXT NOT NULL,
  preferred_domain VARCHAR(120) NOT NULL,
  weekly_availability INT NOT NULL DEFAULT 0,
  program_available BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('new', 'to_review', 'in_evaluation', 'shortlisted', 'interview', 'selected', 'rejected') NOT NULL DEFAULT 'new',
  automatic_score DECIMAL(5,2) NULL,
  human_score DECIMAL(5,2) NULL,
  final_score DECIMAL(5,2) NULL,
  qualification ENUM('priority', 'good_profile', 'to_review', 'low_match', 'low_priority') NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_candidates_application_reference (application_reference),
  KEY idx_candidates_email (email),
  KEY idx_candidates_status (status),
  KEY idx_candidates_domain (domain),
  KEY idx_candidates_automatic_score (automatic_score),
  KEY idx_candidates_final_score (final_score),
  KEY idx_candidates_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE candidate_skills (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidate_id BIGINT UNSIGNED NOT NULL,
  skill_name VARCHAR(120) NOT NULL,
  proficiency_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_candidate_skills_candidate_id (candidate_id),
  CONSTRAINT fk_candidate_skills_candidate
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE projects (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidate_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  problem_solved TEXT NOT NULL,
  candidate_role TEXT NOT NULL,
  personal_contribution TEXT NOT NULL,
  technologies VARCHAR(500) NOT NULL,
  github_url VARCHAR(500) NULL,
  gitlab_url VARCHAR(500) NULL,
  portfolio_url VARCHAR(500) NULL,
  demo_url VARCHAR(500) NULL,
  used_ai BOOLEAN NOT NULL DEFAULT FALSE,
  ai_usage_description TEXT NULL,
  personal_contribution_with_ai TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_projects_candidate_id (candidate_id),
  CONSTRAINT fk_projects_candidate
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE scoring_criteria (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  criterion_key VARCHAR(80) NOT NULL,
  criterion_name VARCHAR(160) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_scoring_criteria_key (criterion_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE candidate_score_details (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidate_id BIGINT UNSIGNED NOT NULL,
  criterion_key VARCHAR(80) NOT NULL,
  raw_score DECIMAL(5,2) NOT NULL,
  weighted_score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_candidate_score_details_candidate_id (candidate_id),
  CONSTRAINT fk_candidate_score_details_candidate
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE evaluations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidate_id BIGINT UNSIGNED NOT NULL,
  admin_id BIGINT UNSIGNED NOT NULL,
  technical_skills TINYINT UNSIGNED NOT NULL,
  problem_solving TINYINT UNSIGNED NOT NULL,
  project_quality TINYINT UNSIGNED NOT NULL,
  motivation TINYINT UNSIGNED NOT NULL,
  learning_potential TINYINT UNSIGNED NOT NULL,
  overall_score DECIMAL(5,2) NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_evaluations_candidate_id (candidate_id),
  KEY idx_evaluations_admin_id (admin_id),
  CONSTRAINT fk_evaluations_candidate
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_evaluations_admin
    FOREIGN KEY (admin_id) REFERENCES admins(id)
    ON DELETE RESTRICT,
  CONSTRAINT chk_evaluations_scores CHECK (
    technical_skills <= 10 AND problem_solving <= 10 AND project_quality <= 10
    AND motivation <= 10 AND learning_potential <= 10
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE candidate_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  candidate_id BIGINT UNSIGNED NOT NULL,
  admin_id BIGINT UNSIGNED NULL,
  action_type ENUM('APPLICATION_RECEIVED', 'AUTO_SCORE_CALCULATED', 'EVALUATION_ADDED', 'SCORE_UPDATED', 'STATUS_CHANGED') NOT NULL,
  old_value VARCHAR(255) NULL,
  new_value VARCHAR(255) NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_candidate_history_candidate_id (candidate_id),
  KEY idx_candidate_history_admin_id (admin_id),
  CONSTRAINT fk_candidate_history_candidate
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_candidate_history_admin
    FOREIGN KEY (admin_id) REFERENCES admins(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

