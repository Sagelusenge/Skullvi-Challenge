# SKULLVI Talent Engine Backend

Express + PostgreSQL API for candidate intake, scoring, evaluations, ranking,
and admin authentication. Requires Node.js 22+ and PostgreSQL 14+.

See the root `README.md` for PowerShell installation commands, database
configuration, the one-time MySQL import, and Render deployment instructions.

From the project root:

```powershell
npm install
npm run db:migrate
npm run setup:check --workspace backend
npm run dev:backend
```

For the initial admin, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before running
`npm run admin:create --workspace backend`. Passwords are stored as bcrypt hashes.

## Endpoints

- `GET /api/v1/health`
- `GET /api/v1/health/ready` (checks the PostgreSQL application schema)
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/candidates`
- `GET /api/v1/candidates`
- `GET /api/v1/candidates/:id`
- `PATCH /api/v1/candidates/:id/status`
- `POST /api/v1/candidates/:id/evaluations`
- `POST /api/v1/candidates/:id/recalculate-score`
- `GET /api/v1/ranking`
- `GET /api/v1/dashboard/stats`
- `GET /api/v1/dashboard/recent-candidates`
- `GET /api/v1/scoring/criteria`
- `PUT /api/v1/scoring/criteria`

## Tests

```powershell
npm test
npm run test:postgres --workspace backend
```

The PostgreSQL integration suite uses a newly created temporary schema on the
configured database. Existing application schemas and data are preserved.

## Architecture

Route -> Controller -> Service -> Repository -> PostgreSQL

Candidate submission uses one transaction to generate a reference, save the
candidate, skills and project, calculate and store scoring details, and write
history events. Any failure rolls the entire transaction back.
