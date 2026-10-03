import bcrypt from 'bcryptjs';
import { pool } from '../src/config/database.js';
import { createAdmin, findAdminByEmail } from '../src/repositories/admin.repository.js';

const admin = {
  firstName: process.env.ADMIN_FIRST_NAME || 'Demo',
  lastName: process.env.ADMIN_LAST_NAME || 'Admin',
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  role: process.env.ADMIN_ROLE || 'admin'
};

if (!admin.email || !admin.password) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD are required.');
  process.exitCode = 1;
} else {
  const existing = await findAdminByEmail(admin.email);
  if (existing) {
    console.error(`Admin already exists: ${admin.email}`);
    process.exitCode = 1;
  } else {
    const passwordHash = await bcrypt.hash(admin.password, 12);
    const id = await createAdmin({ ...admin, passwordHash, isActive: true });
    console.log(`Admin created with id ${id}: ${admin.email}`);
  }
}

await pool.end();
