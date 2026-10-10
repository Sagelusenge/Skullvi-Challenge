import { execute } from '../config/database.js';

export async function findAdminByEmail(email) {
  const rows = await execute(
    `SELECT id, first_name, last_name, email, password_hash, role, is_active
     FROM admins
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email]
  );

  return rows[0] || null;
}

export async function findAdminById(id) {
  const rows = await execute(
    `SELECT id, first_name, last_name, email, role, is_active
     FROM admins
     WHERE id = $1
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

export async function createAdmin(admin, connection = null) {
  const result = await execute(
    `INSERT INTO admins (first_name, last_name, email, password_hash, role, is_active)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [
      admin.firstName,
      admin.lastName,
      admin.email,
      admin.passwordHash,
      admin.role || 'admin',
      admin.isActive ?? true
    ],
    connection
  );

  return result[0].id;
}

