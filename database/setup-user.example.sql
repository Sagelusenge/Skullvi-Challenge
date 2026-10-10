-- Run as a PostgreSQL administrator for a dedicated local database.
-- Replace the example password before running this file.
CREATE ROLE skullvi_app LOGIN PASSWORD 'replace-with-your-password';
CREATE DATABASE skullvi_talent_engine OWNER skullvi_app;

