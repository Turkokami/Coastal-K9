import { NextResponse } from 'next/server';

// Sends inspection requests via Resend. Env: RESEND_API_KEY, INQUIRY_TO (default Kim@ck9ps.com),
// INQUIRY_FROM (a verified Resend sender, e.g. "Coastal K9 Website <inquiries@ck9ps.com>").
// Single-line fields: CR/LF and other control characters become spaces (no header injection), trimmed, capped.
const clean = (v: unknown, n = 500) => String(v ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, n);
// Multi-line field: keeps line breaks, drops other control characters, trimmed, capped.
const cleanMulti = (v: unknown, n = 4000) => String(v ?? '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '').trim().slice(0, n);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export async function POST(req: Request) {
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 }); }
  // Honeypot: real visitors never fill it (the form also clears it on submit). Report success and send nothing.
  if (clean(b.secondary_ref)) return NextResponse.json({ ok: true }); // bot
  const f = {
    name: clean(b.name, 120), phone: clean(b.phone, 40), email: clean(b.email, 160).toLowerCase(), city: clean(b.city, 120),
    propertyType: clean(b.propertyType, 80), service: clean(b.service, 80), address: clean(b.address, 240),
    details: cleanMulti(b.details, 4000), page: clean(b.page, 200),
  };
  if (!f.name || !f.phone || !/^\S+@\S+\.\S+$/.test(f.email) || !f.city) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: 'not configured' }, { status: 503 });
  const rows = Object.entries(f).map(([k, v]) => `<tr><td style="padding:4px 10px;color:#555">${k}</td><td style="padding:4px 10px"><b>${esc(v).replace(/\n/g, '<br>')}</b></td></tr>`).join('');
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.INQUIRY_FROM || 'Coastal K9 Website <inquiries@ck9ps.com>',
      to: (process.env.INQUIRY_TO || 'Kim@ck9ps.com').split(',').map((s) => s.trim()),
      reply_to: f.email,
      subject: `Inspection request — ${f.service || 'service'} — ${f.city}`,
      html: `<h2>New inspection request</h2><table>${rows}</table>`,
    }),
  });
  if (!r.ok) return NextResponse.json({ ok: false, error: 'send failed' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
