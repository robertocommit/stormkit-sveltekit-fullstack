import { json } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import db from '$lib/db.js';

const JWT_SECRET = 'your_jwt_secret'; // In a real app, use an environment variable

export async function POST({ request }) {
  console.log('Auth API route hit');
  try {
    const { username, password } = await request.json();
    console.log('Attempting login for user:', username);

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      console.log('User not found:', username);
      return json({ error: 'User not found' }, { status: 404 });
    }

    const match = await argon2.verify(user.password, password);

    if (!match) {
      console.log('Invalid password for user:', username);
      return json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful for user:', username);
    return json({ token });
  } catch (error) {
    console.error('Error in auth API:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}