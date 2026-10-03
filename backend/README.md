# SKULLVI Talent Engine Backend

Express + MySQL backend for candidate intake, scoring, evaluation, ranking, and admin authentication.

## Prerequisites

- Node.js
- MySQL 8+
- npm

## Installation

From the project root:

```bash
npm install
```

## Environment

Create `backend/.env` from `backend/.env.example`:

```env
PORT=4000
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=skullvi_talent_engine
DB_USER=root
DB_PASSWORD=
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=8h
FRONTEND_URL=http://localhost:5173
```

## Create Database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p skullvi_talent_engine < database/seed.sql
```

On this Windows machine, MariaDB is installed under `C:\Program Files\MariaDB 12.1`. If `mysql` is not in your PATH, use:

```powershell
cmd /c '"C:\Program Files\MariaDB 12.1\bin\mariadb.exe" -u root -p < database\schema.sql'
cmd /c '"C:\Program Files\MariaDB 12.1\bin\mariadb.exe" -u root -p skullvi_talent_engine < database\seed.sql'
```

If the backend reports `auth_gssapi_client`, create a standard application user from the MariaDB console:

```sql
CREATE USER 'skullvi_app'@'localhost' IDENTIFIED BY 'ChangeMe123!';
GRANT ALL PRIVILEGES ON skullvi_talent_engine.* TO 'skullvi_app'@'localhost';
FLUSH PRIVILEGES;
```

The same commands are available in `database/setup-user.example.sql`.

Then set:

```env
DB_USER=skullvi_app
DB_PASSWORD=ChangeMe123!
```

Check that the backend can reach MySQL and that seed data is present:

```bash
npm run setup:check --workspace backend
```

## Create Initial Admin

The seed does not store a raw admin password. Create an admin with:

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=ChangeMe123 npm run admin:create --workspace backend
```

On Windows PowerShell:

```powershell
$env:ADMIN_EMAIL="admin@example.com"; $env:ADMIN_PASSWORD="ChangeMe123"; npm run admin:create --workspace backend
```

## Run Server

```bash
npm run dev --workspace backend
```

Production-style start:

```bash
npm start --workspace backend
```

## Tests

```bash
npm run test --workspace backend
```

## Main Endpoints

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

## Architecture

```text
Route -> Controller -> Service -> Repository -> MySQL
```

The public candidate submission uses a MySQL transaction. The backend validates data, generates a unique reference, stores candidate data, calculates automatic scoring, stores score details, writes history events, and returns only the application reference to the candidate.

