import { execute } from '../config/database.js';

export async function findAdminByEmail(email) {
  const rows = await execute(
    `SELECT id, first_name, last_name, email, password_hash, role, is_active
     FROM admins
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  return rows[0] || null;
}

export async function findAdminById(id) {
  const rows = await execute(
    `SELECT id, first_name, last_name, email, role, is_active
     FROM admins
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

export async function createAdmin(admin, connection = null) {
  const result = await execute(
    `INSERT INTO admins (first_name, last_name, email, password_hash, role, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
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

  return result.insertId;
}

