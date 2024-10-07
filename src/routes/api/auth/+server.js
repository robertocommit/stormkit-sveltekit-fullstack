import { json } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import db from '$lib/db.js';

const JWT_SECRET = 'your_jwt_secret'; // In a real app, use an environment variable

export async function POST({ request }) {
  const { username, password } = await request.json();

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user) {
    return json({ error: 'User not found' }, { status: 404 });
  }

  const match = await argon2.verify(user.password, password);

  if (!match) {
    return json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

  return json({ token });
}