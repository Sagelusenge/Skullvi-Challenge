import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { findAdminByEmail } from '../repositories/admin.repository.js';
import { AppError } from '../utils/apiResponse.js';

function publicAdmin(admin) {
  return {
    id: admin.id,
    firstName: admin.first_name,
    lastName: admin.last_name,
    email: admin.email,
    role: admin.role
  };
}

export async function login({ email, password }) {
  const admin = await findAdminByEmail(email);
  if (!admin || !admin.is_active) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(password, admin.password_hash);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = publicAdmin(admin);

  return {
    user,
    token: jwt.sign(user, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
  };
}

export function me(user) {
  return user;
}

