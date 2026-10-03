# Database

Database name: `skullvi_talent_engine`  
Engine: MySQL, InnoDB, `utf8mb4`.

## Tables

`application_reference_sequences` stores yearly counters used inside transactions to generate unique references such as `SK-2026-0001`.

`admins` stores private admin/reviewer accounts. Passwords are stored only as bcrypt hashes.

`candidates` stores submitted applications. The candidate has no account. Important score fields are `automatic_score`, `human_score`, `final_score`, and `qualification`.

`candidate_skills` stores one row per declared skill and is deleted automatically when the candidate is deleted.

`projects` stores the candidate’s main project. It has a one-to-one relation with `candidates`.

`scoring_criteria` stores criterion weights and max scores. Active weights must total `100`.

`candidate_score_details` stores automatic scoring explanations by criterion.

`evaluations` stores human reviews by admins. Notes are constrained to `0..10`; `overall_score` is calculated by the backend.

`candidate_history` stores audit events such as `APPLICATION_RECEIVED`, `AUTO_SCORE_CALCULATED`, `EVALUATION_ADDED`, `SCORE_UPDATED`, and `STATUS_CHANGED`.

## Main Relations

- `candidate_skills.candidate_id` -> `candidates.id` with cascade delete.
- `projects.candidate_id` -> `candidates.id` with cascade delete.
- `candidate_score_details.candidate_id` -> `candidates.id` with cascade delete.
- `evaluations.candidate_id` -> `candidates.id` with cascade delete.
- `evaluations.admin_id` -> `admins.id` with restricted delete.
- `candidate_history.candidate_id` -> `candidates.id` with cascade delete.
- `candidate_history.admin_id` -> `admins.id` with set null delete.

## Indexes

Indexes are defined for application reference, candidate email, status, domain, automatic score, final score, submission date, candidate skills, evaluations, and candidate history.

