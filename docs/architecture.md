# Architecture

The frontend is developed separately. The backend exposes a REST API used by the public application form and the admin workspace.

```text
React frontend
-> Express API
-> Controllers
-> Services
-> Repositories
-> MySQL
```

## Backend Flow

Controllers are intentionally thin. They read request data, call services, and return formatted API responses.

Services contain business logic: candidate submission, scoring, human evaluation, final score calculation, ranking, and status changes.

Repositories centralize SQL queries and use parameterized MySQL statements.

## Candidate Submission Flow

```text
Candidate form
-> server validation
-> MySQL transaction
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

