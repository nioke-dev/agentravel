// File: app/api/pengguna/login/route.ts

import { Hono } from 'hono';
import dbConnect from '@/database/connection/mongodb';
import { Pengguna } from '@/database/model/all';

// Inisialisasi Hono untuk endpoint login
const loginApi = new Hono();

// Pastikan koneksi DB hanya sekali
await dbConnect();

/**
 * POST /api/pengguna/login
 * Body: { username: string, password: string }
 * Response: { role: string } atau error
 */
loginApi.post('/', async (c) => {
  try {
    const { username, password } = await c.req.json();

    // Cari pengguna berdasarkan username
    const user = await Pengguna.findOne({ username });
    if (!user) {
      return c.json({ error: 'Username tidak ditemukan' }, 404);
    }

    // Verifikasi password (pastikan di model ada method comparePassword)
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return c.json({ error: 'Password salah' }, 401);
    }

    // Berhasil login, kembalikan role (atau token JWT)
    return c.json({ role: user.role });
  } catch (err: unknown) {
    console.error('Login error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Eksport handler untuk Next.js App Router
export default loginApi;
export const POST = loginApi.fetch;
