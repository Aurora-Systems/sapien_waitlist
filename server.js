import 'dotenv/config';
import express from 'express';
import { neon } from '@neondatabase/serverless';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const sql = neon(process.env.DATABASE_URL);

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/waitlist', async (req, res) => {
  const {
    email,
    first_name,
    last_name,
    company,
    role,
    industry,
    company_size,
    monthly_verifications,
    needs,
    notes,
  } = req.body;

  if (!email || !first_name || !last_name || !company || !role || !industry || !company_size) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  await sql`
    INSERT INTO company_waitlist
      (email, first_name, last_name, company, role, industry, company_size, monthly_verifications, needs, notes)
    VALUES
      (${email}, ${first_name}, ${last_name}, ${company}, ${role}, ${industry}, ${company_size},
       ${monthly_verifications ?? null}, ${needs ?? []}, ${notes ?? ''})
  `;

  res.json({ ok: true });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Sapien waitlist server running on http://localhost:${port}`));
