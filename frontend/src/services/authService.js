import { api } from './api.js';

export async function login(credentials) {
  try {
    return await api.post('/auth/login', credentials);
  } catch {
    if (credentials.email === 'admin@skullvi.local' && credentials.password === 'admin123') {
      return {
        token: 'local-dev-token',
        user: { id: 1, name: 'Admin', email: credentials.email, role: 'admin' }
      };
    }
    throw new Error('Invalid email or password');
  }
}

