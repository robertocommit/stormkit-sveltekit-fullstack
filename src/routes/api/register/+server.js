import { json } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import db from '$lib/db.js';

export async function POST({ request }) {
  const { username, password } = await request.json();

  const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (existingUser) {
    return json({ error: 'Username already exists' }, { status: 400 });
  }

  const hashedPassword = await argon2.hash(password);

  const info = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);

  return json({ id: info.lastInsertRowid, username });
}