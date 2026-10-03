# API SKULLVI Talent Engine

Base URL: `/api/v1`

All success responses follow:

```json
{ "success": true, "message": "...", "data": {} }
```

All errors follow:

```json
{ "success": false, "message": "...", "errors": [] }
```

## Health

Method: `GET`  
URL: `/health`  
Authentication: none

Response:

```json
{ "success": true, "message": "API is healthy.", "data": { "status": "ok" } }
```

## Auth

### Login

Method: `POST`  
URL: `/auth/login`  
Authentication: none

Request body:

```json
{ "email": "admin@example.com", "password": "secret" }
```

Response: returns `user` and `token`.

Possible errors: `401`, `422`.

### Current Admin

Method: `GET`  
URL: `/auth/me`  
Authentication: Bearer token

Possible errors: `401`.

### Logout

Method: `POST`  
URL: `/auth/logout`  
Authentication: Bearer token

Note: logout is stateless; the frontend should discard the token.

## Candidates

### Submit Public Application

Method: `POST`  
URL: `/candidates`  
Authentication: none

Request body includes candidate profile, `skills`, optional `project`, motivation, learning goal, availability, and program availability.

Response:

```json
{
  "success": true,
  "message": "Candidature enregistrée avec succès.",
  "data": { "applicationReference": "SK-2026-0001" }
}
```

The public response never exposes scores or admin data.

Possible errors: `400`, `409`, `422`, `500`.

### List Candidates

Method: `GET`  
URL: `/candidates`  
Authentication: Bearer token

Query params: `page`, `limit`, `search`, `domain`, `status`, `minScore`, `maxScore`, `sortBy`, `order`.

Possible errors: `401`, `422`.

### Candidate Details

Method: `GET`  
URL: `/candidates/:id`  
Authentication: Bearer token

Response includes personal data, skills, project, automatic score details, evaluations, final score, qualification, and history.

Possible errors: `401`, `404`.

### Update Status

Method: `PATCH`  
URL: `/candidates/:id/status`  
Authentication: Bearer token

Request body:

```json
{ "status": "shortlisted" }
```

Valid statuses: `new`, `to_review`, `in_evaluation`, `shortlisted`, `interview`, `selected`, `rejected`.

Possible errors: `400`, `401`, `404`, `422`.

### Add Human Evaluation

Method: `POST`  
URL: `/candidates/:id/evaluations`  
Authentication: Bearer token

Request body:

```json
{
  "technicalSkills": 8,
  "problemSolving": 9,
  "projectQuality": 8,
  "motivation": 9,
  "learningPotential": 9,
  "comment": "Très bon potentiel."
}
```

The backend recalculates `overallScore`, `humanScore`, and `finalScore`.

Possible errors: `401`, `404`, `422`.

### Recalculate Candidate Score

Method: `POST`  
URL: `/candidates/:id/recalculate-score`  
Authentication: Bearer token

Recalculates only the selected candidate.

## Ranking

Method: `GET`  
URL: `/ranking`  
Authentication: Bearer token

Query params: `domain`, `status`, `minScore`, `maxScore`.

Ranking uses `final_score` when present, otherwise `automatic_score`.

## Dashboard

Method: `GET`  
URL: `/dashboard/stats`  
Authentication: Bearer token

Returns totals by status and average automatic/final scores.

Method: `GET`  
URL: `/dashboard/recent-candidates`  
Authentication: Bearer token

Query params: `limit`.

## Scoring

Method: `GET`  
URL: `/scoring/criteria`  
Authentication: Bearer token

Method: `PUT`  
URL: `/scoring/criteria`  
Authentication: Bearer token

Request body:

```json
{
  "criteria": [
    { "criterionKey": "technical_skills", "weight": 35, "maxScore": 35, "isActive": true }
  ]
}
```

The active weight total must equal exactly `100`; otherwise the API returns `400`.

Method: `POST`  
URL: `/scoring/recalculate-all`  
Authentication: Bearer token

In this mini-challenge, bulk recalculation is intentionally rejected. Use per-candidate recalculation for explicit updates.

