# Architecture

The frontend is developed separately. The backend exposes a REST API used by the public application form and the admin workspace.

```text
React frontend
-> Express API
-> Controllers
-> Services
-> Repositories
-> PostgreSQL
```

## Backend Flow

Controllers are intentionally thin. They read request data, call services, and return formatted API responses.

Services contain business logic: candidate submission, scoring, human evaluation, final score calculation, ranking, and status changes.

Repositories centralize SQL queries and use parameterized PostgreSQL statements
with `$1`, `$2`, etc. Every transaction uses one client from the connection pool.

## Candidate Submission Flow

```text
Candidate form
-> server validation
-> PostgreSQL transaction
-> unique reference generation
-> candidate insert
-> skills insert
-> optional project insert
-> automatic scoring
-> score detail insert
-> candidate score update
-> history events
-> commit
-> confirmation with reference
```

If any step fails, the transaction rolls back.

## Admin Flow

Admins authenticate with email/password. Passwords are compared with bcrypt hashes. After login, the API returns a JWT used for protected routes.

Protected admin features include candidate listing, candidate details, human evaluations, ranking, dashboard stats, scoring criteria updates, score recalculation, and status changes.

## Deployment

On Render, Express serves the Vite build and the API from one origin. React
routes such as `/login` and `/admin` fall back to `index.html`; unknown API
routes keep their JSON 404 response. Vite proxies `/api` during development.
The server binds to `0.0.0.0` and Render's `PORT`, trusts one Render proxy,
and closes its HTTP server and PostgreSQL pool on shutdown.

