# Migrations

Place timestamped SQL migration files here as the schema evolves.

Run `npm run db:migrate` from the repository root. Each SQL file runs only once,
tracked in the application schema's `schema_migrations` table. All pending files
run in one transaction with an advisory lock. Do not edit an applied migration;
add a new file instead. The baseline schema and default criteria are versioned
by the runner. Demonstration seed data is excluded from production migrations.

Recommended naming:

```text
YYYYMMDDHHMM_description.sql
```

