-- Run this as a MariaDB/MySQL administrator, then copy the same values into backend/.env.
-- Change the password before using the app beyond local development.

CREATE USER IF NOT EXISTS 'skullvi_app'@'localhost' IDENTIFIED BY 'ChangeMe123!';
GRANT ALL PRIVILEGES ON skullvi_talent_engine.* TO 'skullvi_app'@'localhost';
FLUSH PRIVILEGES;

