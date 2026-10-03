# Scoring System

The scoring system helps admins prioritize human review. It is not a final decision system and must never automatically select or reject a candidate.

## Automatic Score

Automatic scoring is deterministic, transparent, and testable. It does not call an AI API and does not use random values.

Default active criteria:

- `technical_skills`: 35
- `project_experience`: 25
- `motivation`: 20
- `availability`: 10
- `application_quality`: 10

The total active weight must equal `100`.

## Criterion Rules

Technical skills considers the number of skills and declared levels. It does not favor a specific language or framework.

Project experience considers project presence, description, problem, role, personal contribution, technologies, and optional public links. Missing GitHub/GitLab/demo links do not automatically make a profile bad.

Motivation considers response presence and completeness, but also basic text quality checks. The backend checks word count, lexical diversity, vowel ratio, spaces, repeated character runs, and a few context words related to learning, projects, development, skills, or the program. This prevents long random strings from receiving a strong motivation score. It still does not judge sincerity or personality.

Availability considers weekly available hours and whether the candidate is available for the program.

Application quality checks important completed fields and validates links when provided.

## Human Score

Admins rate five criteria from `0` to `10`:

- technical skills
- problem solving
- project quality
- motivation
- learning potential

The backend calculates:

```text
overall_score = average(five notes) * 10
```

If several admins evaluate the same candidate:

```text
human_score = average(overall_score values)
```

## Final Score

When a human score exists:

```text
final_score = automatic_score * 0.60 + human_score * 0.40
```

When no human evaluation exists yet, `final_score` remains `NULL`. Ranking temporarily uses `automatic_score` in that case.

## Qualification

- `85-100`: `priority`
- `70-84`: `good_profile`
- `55-69`: `to_review`
- `40-54`: `low_match`
- `0-39`: `low_priority`

A qualification is only a review aid, not a final hiring decision.

