import { json } from '@sveltejs/kit';

export function GET() {
  console.log('Hello API endpoint hit');
  return json({ message: 'Hello from the server!' });
}
