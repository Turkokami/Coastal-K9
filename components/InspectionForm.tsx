'use client';
import { useState, useId } from 'react';
import { SITE } from '@/lib/site';

const PROPERTY = ['Residential Home', 'Apartment/Condo', 'Hotel/Motel', 'Commercial Property', 'School', 'Healthcare Facility', 'Restaurant', 'Warehouse', 'Food Processing / Agriculture', 'Other'];
const SERVICE = ['Bed Bug Detection', 'Bed Bug Treatment', 'Rodent Detection', 'Rodent/Wildlife Exclusion', 'Goose Management', 'Bird Exclusion', 'General Pest Control', 'Nationwide Rodent Program', 'Multiple Services'];

export default function InspectionForm({ compact = false, heading = 'Request an Inspection', anchor = false }: { compact?: boolean; heading?: string; anchor?: boolean }) {
  const hid = useId();
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle');
  const [err, setErr] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState('sending'); setErr('');
    try {
      const r = await fetch('/api/inquiry/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, page: window.location.pathname }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || 'send failed');
      (window as any).dataLayer?.push({ event: 'generate_lead', form: 'inspection' });
      window.location.assign('/thank-you/');
    } catch (ex: any) {
      setState('error');
      setErr(ex?.message === 'invalid' ? 'Please fill in your name, phone, email and city.' : `Something went wrong sending your request. Please call ${SITE.phone} — we answer.`);
    }
  }

  return (
    <form className={`ifm${compact ? ' ifm-compact' : ''}`} onSubmit={onSubmit} id={anchor ? 'inspection' : undefined} aria-labelledby={hid} noValidate={false}>
      <h2 id={hid}>{heading}</h2>
      <p className="ifm-sub">Tell us what you’re dealing with and Kim or a Coastal K9 specialist will call you back — usually the same business day.</p>
      <div className="ifm-grid">
        <label><span className="lbl">Full name<i aria-hidden="true">*</i></span><input name="name" required autoComplete="name" /></label>
        <label><span className="lbl">Phone<i aria-hidden="true">*</i></span><input name="phone" type="tel" required autoComplete="tel" inputMode="tel" /></label>
        <label><span className="lbl">Email<i aria-hidden="true">*</i></span><input name="email" type="email" required autoComplete="email" /></label>
        <label><span className="lbl">City<i aria-hidden="true">*</i></span><input name="city" required autoComplete="address-level2" /></label>
        <label><span className="lbl">Property type<i aria-hidden="true">*</i></span>
          <select name="propertyType" required defaultValue="">
            <option value="" disabled>Choose…</option>
            {PROPERTY.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <label><span className="lbl">Service needed<i aria-hidden="true">*</i></span>
          <select name="service" required defaultValue="">
            <option value="" disabled>Choose…</option>
            {SERVICE.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        {!compact && <label className="ifm-wide"><span className="lbl">Inspection address</span><input name="address" autoComplete="street-address" /></label>}
        <label className="ifm-wide"><span className="lbl">What are you seeing?</span><textarea name="details" rows={compact ? 2 : 4} /></label>
        {/* honeypot — named so mobile autofill leaves it alone */}
        <div className="hp" aria-hidden="true"><label>Leave blank<input name="secondary_ref" tabIndex={-1} autoComplete="off" data-1p-ignore data-lpignore="true" /></label></div>
      </div>
      <button className="btn btn-primary btn-lg ifm-submit" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Request My Inspection'}
      </button>
      <p className="ifm-alt">Prefer to talk? Call or text <a href={SITE.phoneHref}>{SITE.phone}</a> · Mon–Fri 8–6, Sat 8–4</p>
      <p role="alert" aria-live="assertive" className="ifm-err">{state === 'error' ? err : ''}</p>
    </form>
  );
}
