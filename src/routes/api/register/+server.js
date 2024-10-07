import { json } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import db from '$lib/db.js';

export async function POST({ request }) {
  console.log('Register API route hit');
  try {
    const { username, password } = await request.json();
    console.log('Attempting to register user:', username);

    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (existingUser) {
      console.log('Username already exists:', username);
      return json({ error: 'Username already exists' }, { status: 400 });
    }

    const hashedPassword = await argon2.hash(password);

    const info = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);
    console.log('User registered successfully:', username);
    return json({ id: info.lastInsertRowid, username });
  } catch (error) {
    console.error('Error in register API:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}