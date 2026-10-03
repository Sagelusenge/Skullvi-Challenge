import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import request from 'supertest';

const findAdminByEmail = jest.fn();

jest.unstable_mockModule('../src/repositories/admin.repository.js', () => ({
  findAdminByEmail
}));

const { login } = await import('../src/services/auth.service.js');
const { env } = await import('../src/config/env.js');
const { default: app } = await import('../src/app.js');

beforeEach(() => {
  findAdminByEmail.mockReset();
});

test('valid admin login returns a JWT', async () => {
  findAdminByEmail.mockResolvedValue({
    id: 1,
    first_name: 'Demo',
    last_name: 'Admin',
    email: 'admin@example.com',
    password_hash: await bcrypt.hash('secret123', 10),
    role: 'admin',
    is_active: true
  });

  const session = await login({ email: 'admin@example.com', password: 'secret123' });
  expect(session.user.email).toBe('admin@example.com');
  expect(jwt.verify(session.token, env.jwtSecret).email).toBe('admin@example.com');
});

test('incorrect password is rejected', async () => {
  findAdminByEmail.mockResolvedValue({
    id: 1,
    first_name: 'Demo',
    last_name: 'Admin',
    email: 'admin@example.com',
    password_hash: await bcrypt.hash('secret123', 10),
    role: 'admin',
    is_active: true
  });

  await expect(login({ email: 'admin@example.com', password: 'wrong' }))
    .rejects.toThrow('Invalid email or password');
});

test('unknown admin is rejected', async () => {
  findAdminByEmail.mockResolvedValue(null);

  await expect(login({ email: 'missing@example.com', password: 'secret123' }))
    .rejects.toThrow('Invalid email or password');
});

test('protected route rejects missing token', async () => {
  const response = await request(app).get('/api/v1/candidates');
  expect(response.status).toBe(401);
});

test('protected route rejects invalid token', async () => {
  const response = await request(app)
    .get('/api/v1/candidates')
    .set('Authorization', 'Bearer invalid-token');
  expect(response.status).toBe(401);
});

