import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email, first_name, last_name, company, role, industry, company_size, monthly_verifications, needs, notes } = body;

  if (!email || !first_name || !last_name || !company || !role || !industry || !company_size) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await sql`
    INSERT INTO company_waitlist
      (email, first_name, last_name, company, role, industry, company_size, monthly_verifications, needs, notes)
    VALUES
      (${email}, ${first_name}, ${last_name}, ${company}, ${role}, ${industry}, ${company_size},
       ${monthly_verifications ?? null}, ${needs ?? []}, ${notes ?? ''})
  `;

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const config = {
  path: '/api/waitlist',
};
