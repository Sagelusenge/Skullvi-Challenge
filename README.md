# Skullvi Talent Engine

Skullvi Talent Engine is a recruitment platform with a public candidate application flow and an admin dashboard for evaluation, ranking, reports, and scoring criteria.

## Project Structure

- `frontend/`: React + Vite application.
- `backend/`: Express API.
- `database/`: SQL schema, seed data, and migrations.
- `docs/`: Architecture, API, database, and scoring documentation.

## Quick Start

Requires Node.js 22+ and PostgreSQL 14+.

From the project root, in PowerShell:

```powershell
npm install
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Create the PostgreSQL database, then set its credentials in `backend/.env`
using `DATABASE_URL` or `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`.
For a shared PostgreSQL instance, set `DB_SCHEMA=skullvi` to isolate all application tables.

```powershell
npm run db:migrate
$env:ADMIN_EMAIL='admin@example.com'
$env:ADMIN_PASSWORD='replace-with-your-password'
npm run admin:create --workspace backend
npm run setup:check --workspace backend
```

Start these commands in two separate terminals:

```powershell
npm run dev:frontend
npm run dev:backend
```

- Application form: http://localhost:5173/
- Admin login: http://localhost:5173/login
- API: http://localhost:4000/api/v1

## Render

A single Node web service serves both the React build and the Express API.
The Blueprint in `render.yaml` uses an existing PostgreSQL instance.

- Build command: `npm ci --include=dev && npm run build`
- Start command: `npm start`
- Health check: `/api/v1/health/ready`
- `DATABASE_URL`: internal URL of the PostgreSQL instance in the same Render region.
- `DB_SCHEMA=skullvi`: separate application schema on the shared instance.
- `DB_SSL=false`: internal connection; use `true` for external local connections.
- `VITE_API_URL=/api/v1`: same-origin API URL.
- `JWT_SECRET`: a generated secret stored in Render environment variables.

`npm start` runs versioned migrations before starting the server. It never loads
demonstration candidates or resets existing criteria. Create the first admin
with `admin:create` or preserve existing accounts with the MySQL import below.

To run the production build locally:

```powershell
$env:VITE_API_URL='/api/v1'
npm run build
npm start
```

Open http://localhost:4000/ (form) or http://localhost:4000/login (admin).

## Import Existing MySQL Data

Before changing the original backend configuration, preserve it in the ignored
`backend/.migration/mysql.env` file. Configure `backend/.env` for PostgreSQL, then run:

```powershell
npm run db:migrate
npm run db:import-mysql --workspace backend
```

The destination candidate and admin tables must be empty. The importer reads
MySQL without modifying it, saves an ignored JSON backup, and copies all nine
tables in a PostgreSQL transaction. It preserves IDs, admin bcrypt hashes,
scoring configuration, evaluations, history, and application counters.
`mysql2` is only a development dependency for this one-time import.

## Verification

```powershell
npm test
npm run test:postgres --workspace backend
npm run build
```

The PostgreSQL integration tests require a configured database and permission
to create a temporary schema. They remove only the schema they create.
`database/seed.sql` contains optional demonstration data for a fresh local database;
it is never imported automatically in production.

